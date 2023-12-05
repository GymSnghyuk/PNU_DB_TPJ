const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);

/* GET home page. */
const empty_posts = [{}];

router.get(`/`, (req, res) => {
    if(req.session.user){
        if(req.session.user.category == 1){
            const querystring = `
                with dis_hobby as (
                    SELECT hobby
                    FROM disabled
                    WHERE user_id = '${req.session.user.id}'
                )
                SELECT P.program_id, P.date, P.title
                FROM program P, dis_hobby D
                WHERE P.category = D.hobby
                ORDER BY P.program_id;
            `;

            dbClient.query(querystring)
                .then((results)=>{
                    res.render(`index`, {
                        posts: results.rows,
                        hidden_div : false,
                    });                    
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error: "오류났어요"});
                })
        }
        else{
            res.render(`index`, {
                posts: empty_posts,
                hidden_div : true,
            });
        }
    } else  {
        res.render(`index`, {
            posts: empty_posts,
            hidden_div : true,
        });
    }
});

module.exports = router;
