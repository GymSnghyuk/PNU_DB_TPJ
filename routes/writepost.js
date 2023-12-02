const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);
const id_num_min = require(`./register_category/id_num_min`);

router.get(`/`, (req, res, next)=>{
    res.render(`write`);
})

router.post(`/`, (req, res, next) => {
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',async function(){
        if(req.session.user.category == 0){
            let post = qs.parse(body);
            const postid = await id_num_min.GET_ID_NUM(`post`) +1;
            const userid = req.session.user.id;
            const name = req.session.user.name;
            
            const querystring = `
                insert into post values (${postid},1, '${post.title}','${post.content}' ,'${post.date}','9:00');
            `;
    
            dbClient.query(querystring)
                .then((results)=>{
                    res.redirect(`/postlist`);
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error : `오류 : 게시글 등록 안됨`});
                })
        }
    })
})

module.exports = router;