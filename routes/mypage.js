const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/`, async (req,res,next)=>{
    if(!req.session.user){
        res.render(`alert`, {error: "로그인 후 이용해주세요."});
    } else{
            const querystring = `
                SELECT *
                FROM account A
                WHERE A.user_id = '${req.session.user.id}';
            `;

            let data = {};

            await dbClient.query(querystring)
                .then((ans)=>{
                    data = {
                        id : ans.rows[0]['user_id'],
                        name : ans.rows[0]['name'],
                        user_category : ans.rows[0]['user_category']
                    }
                })
                .catch((err)=>{
                    console.error(`mypage 오류발생`);
                })
            
        if(req.session.user.category == 4){
            const querystr = `
                with findteacherid as (
                    SELECT teacher_id
                    FROM teacher
                    WHERE user_id = '${req.session.user.id}'
                )
                SELECT P.title, P.date, P.program_id, P.count as howmany
                FROM findteacherid F, program P
                WHERE F.teacher_id = P.teacher_id
                ;
            `;

            await dbClient.query(querystr)
                .then((ans)=>{
                    res.render(`mypage`,{
                        id : data.id,
                        name : data.name,
                        user_category : data.user_category,
                        posts : ans.rows,
                        hidden_ticketing : "게시 목록",
                        cancel_hidden : "",
                    });
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error: "게시 목록 불러오기 실패"})
                })

        } else{
            const querystr = `
                SELECT P.title, P.date, T.howmany, P.program_id
                FROM ticketing T, program P
                WHERE T.user_id = '${req.session.user.id}' and
                    P.program_id = T.program_id;
            `;

            await dbClient.query(querystr)
                .then((ans)=>{
                    res.render(`mypage`,{
                        id : data.id,
                        name : data.name,
                        user_category : data.user_category,
                        posts : ans.rows,
                        hidden_ticketing : "신청 목록",
                        cancel_hidden : "신청 취소",
                    })
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error: "여기서 버그걸릴수도 있음"});
                })
        }
        
    }
    
})

module.exports = router;