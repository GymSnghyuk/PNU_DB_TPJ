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

        const querystr = `
            SELECT P.title, P.date, T.howmany
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
                    posts : ans.rows
                })
            })
            .catch((err)=>{
                console.error(err);
                res.render(`alert`, {error: "여기서 버그걸릴수도 있음"});
            })
    }
    
})

module.exports = router;