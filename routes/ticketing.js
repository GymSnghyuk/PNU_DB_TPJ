const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);

router.get(`/:id`, async (req, res, next)=>{
    if(req.session.user){
        const check_ticketing = `
            SELECT *
            FROM ticketing
            WHERE program_id = ${req.params.id}
                and user_id = '${req.session.user.id}';
        `;

        let check;
        await dbClient.query(check_ticketing)
            .then((results)=>{
                check = results.rowCount;
            })
            .catch((err)=>{
                console.error(err);
            })
        
        if(check==0){
            const querystring = `
                SELECT count, count_max
                FROM program
                WHERE program_id = ${req.params.id};
            `;

            dbClient.query(querystring)
                .then((results)=>{
                    res.render(`ticketing`,
                        {count_current : results.rows[0].count, 
                        count_max : results.rows[0].count_max,
                        post_id : req.params.id});
                })
        } else{
            res.render(`alert`, {error: "이미 신청한 프로그램입니다."});
        }
        

    } else{
        res.render("alert", {error:"로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요."});
    }
})

router.post(`/:id`, (req, res, next)=>{
    if(req.session.user){
        let body = ``;
        req.on('data', function (data) {
            body += data;
        });
    
        req.on('end', async function(){        
            let post = await qs.parse(body);
        
            const updatequery = `
                UPDATE program 
                SET count=count + ${post.howmany}
                WHERE program_id = ${req.params.id};
            `;

            await dbClient.query(updatequery)
                .then((results)=>{
                    console.log("program 테이블 count 업데이트 성공");
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error: "DB에 count 업데이트 못했음"});
                })

            const querystring = `
                INSERT INTO ticketing VALUES (${req.params.id}, '${req.session.user.id}',${post.howmany});
            `;

            await dbClient.query(querystring)
                .then((results)=>{
                    console.log("신청 성공");
                    res.redirect(`/post/${req.params.id}`);
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error: "count 업데이트 후 "})
                })
        });
    }
    else{
        res.render(`alert`, {error: "로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요."});
    }
})

module.exports = router;