const express = require('express');
const router = express.Router();
const qs = require(`querystring`);
const dbClient = require(`../lib/db`);

router.get(`/:id`,async (req, res, next)=>{
    if (req.session.user) {

        const find_teacher_id_query = `
            with t_userid as (
                SELECT T.teacher_id, A.name
                FROM account A, teacher T
                WHERE A.user_id = T.user_id
            )
                SELECT Tu.name
                FROM t_userid Tu, program P
                WHERE tu.teacher_id = P.teacher_id
                and P.program_id = ${req.params.id};
        `;

        let auth;
        await dbClient.query(find_teacher_id_query)
            .then((results)=>{
                auth = results.rows[0].name;

            })
            .catch((err)=>{
                console.error(err);
                res.render(`alert`, {error: `오류 : 작성자를 찾지 못함`});
            });


        const querystring = `
            SELECT *
            FROM program
            WHERE program_id = ${req.params['id']} ;
        `

        dbClient.query(querystring)
            .then((results)=>{
                const post_data = results.rows[0];
                res.render(`post`, {
                    post_title : post_data['title'],
                    post_write_date : post_data['write_date'],
                    post_content : post_data['content'],
                    post_auth : auth,
                    post_category : post_data['category'],
                    post_count_max : post_data['count_max'],
                    post_count : post_data['count'],
                    post_date : post_data['date'],
                    post_id : post_data['program_id'],
                    user_category : req.session.user.category,
                });
            })
            .catch((err)=>{
                console.error(err);
                res.render(`alert`, "오류 발생");
            })
    } else {
        res.redirect("/login"); // fhrmdlsdmfh
      }
});

router.post(`/delete/:pid`, async (req,res,next)=>{
    if(req.session.user){
        let author_check = false;
        const author_query = `
        SELECT T.teacher_id
        FROM program P, teacher T
        WHERE P.teacher_id = T.teacher_id
            and T.user_id = '${req.session.user.id}'
            and P.program_id = ${Number(req.params.pid)};
        `;
        console.log(req.session.user.id);
        console.log(req.params.pid);
        await dbClient.query(author_query)
            .then((results)=>{
                console.log(results.rowCount);
                if(results.rowCount == 1){
                    author_check = true;
                }
                else {
                    console.error(`alert`, {error : "삭제 권한이 없습니다."});
                }
            })
            .catch((err)=>{
                console.error(err);
                res.render(`alert`, {error: "author_query 인증 오류"});
            });

        if(author_check){
            const deletepostquery = 
            `
                DELETE
                FROM program
                WHERE program_id = ${req.params.pid};
    
                DELETE
                FROM ticketing
                WHERE program_id = ${req.params.pid};
            `;

            await dbClient.query(deletepostquery)
                .then((results)=>{
                    res.redirect(`/postlist`);
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error: "삭제 실패 : 오류 "});
                })
        } else {
            res.render(`alert`, {error : "삭제 권한이 없습니다. 본인 게시글을 선택해주세요."});
        }
        
        
        
        

    } else {
        res.render(`alert`, {error: "세션 만료. 재로그인 해주세요."});
    }
});




router.get(`/update/:pid`, async (req,res,next)=>{
    if(req.session.user){
         
 
         let author_check = false;
         const author_query = `
         SELECT T.teacher_id
         FROM program P, teacher T
         WHERE P.teacher_id = T.teacher_id
             and T.user_id = '${req.session.user.id}'
             and P.program_id = ${Number(req.params.pid)};
         `;
         console.log(req.session.user.id);
         console.log(req.params.pid);
         await dbClient.query(author_query)
             .then((results)=>{
                 console.log(results.rowCount);
                 if(results.rowCount == 1){
                     author_check = true;
                 }
                 else {
                     console.error(`alert`, {error : "수정 권한이 없습니다."});
                 }
             })
             .catch((err)=>{
                 console.error(err);
                 res.render(`alert`, {error: "author_query 인증 오류"});
             });
 
         if(author_check){
             const load_post_query =
             `
                 select to_char(date, 'YYYY-MM-DD' ) as date, title, content, count_max, program_id
                 from program
                 WHERE program_id = ${req.params.pid};
             `;
 
             let tmp_results;
             await dbClient.query(load_post_query)
                 .then((results)=>{
                     tmp_results = results.rows[0];
                 })
                 .catch((err)=>{
                     console.error(err);
                     res.render(`alert`, {error: "프로그램 정보 읽기 실패"});
                 });
             
             res.render(`update`, {
                 programid : req.params.pid,
                 posts: tmp_results
             });
             
         } else {
             res.render(`alert`, {error : "수정 권한이 없습니다. 본인 게시글을 선택해주세요."});
         }
 
    } else {
         res.render(`alert`, {error : "세션 만료. 재로그인 해주세요."});
    }
 });

 
 router.post(`/update/:pid`, (req,res,next)=>{
    if(req.session.user){
        let body = ``;
        req.on('data', function (data) {
            body += data;
        });
    
        req.on('end',async function(){
            let post = qs.parse(body);
            const userid = req.session.user.id;

            const update_post_query = `
                UPDATE program
                SET
                    title = '${post.title}',
                    content = '${post.content}',
                    category = '${post.category}' ,
                    date = '${post.date}'
                WHERE 
                    program_id = ${req.params.pid};
            `;

            dbClient.query(update_post_query)
                .then((results)=>{
                    console.log("업데이트 성공");
                    res.redirect(`/post/${req.params.pid}`);
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error : "프로그램 수정 완료"});
                });

        });
        
    } else {
        res.render(`alert`, {error : "세션 만료. 재로그인 해주세요."});
    }
})

module.exports = router;