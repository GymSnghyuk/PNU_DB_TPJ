const express = require('express');
const router = express.Router();
const qs = require(`querystring`);
const dbClient = require(`../lib/db`);

router.get(`/`, (req,res,next)=>{
    res.render(`finder`);
})

//검색단어 입력 후 검색버튼 누르면

router.post(`/`, (req,res,next)=>{
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    console.log(">?>?>>>");

    req.on('end',function(){
        let post = qs.parse(body);

        const querystring = 
            `
            SELECT *
            FROM post P
            WHERE P.title LIKE '%${post.findkey}%';
            `;

        dbClient
            .query(querystring)
            .then((ans)=> {
                console.log(ans.rows);
                res.send(ans.rows);
            })
            .catch((e) => {
                res.render(`alert`, {error : `오류`})
                console.error(e.stack)
            });
    });
})

module.exports = router;