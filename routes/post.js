const express = require('express');
const router = express.Router();
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
                    user_category : req.session.category,
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

router.post(`/delete/:pid`, (req,res,next)=>{
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
        dbClient.query(author_query)
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




        const deletepostquery = 
        `
            DELETE
            FROM program
            WHERE program_id = ${req.params.pid};
        `;


    } else {
        res.render(`alert`, {error: "세션 만료. 재로그인 해주세요."});
    }
});

router.post(`/update/:pid`, (req,res,next)=>{
    
});

module.exports = router;