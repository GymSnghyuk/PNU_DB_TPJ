const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/`, (req,res,next)=>{
    if(!req.session.user){
        res.render(`alert`, {error: "로그인 후 이용해주세요."});
    } else{
        const querystring = `
            SELECT *
            FROM account A
            WHERE A.user_id = '${req.session.user.id}';
        `;

        dbClient.query(querystring)
            .then((ans)=>{
                res.render(`mypage`,{
                    id : ans.rows[0]['user_id'],
                    name : ans.rows[0]['name'],
                    user_category : ans.rows[0]['user_category']
                })        
            })
    }
    
})

module.exports = router;