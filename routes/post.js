const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/:id`, (req, res, next)=>{
    req.params // post.postid

    const querystring = `
        SELECT title, Po.date as date, Po.content, Pr.teacher_id
        FROM post Po, program Pr
        WHERE Po.post_id = ${req.params['id']} 
            and Po.program_id = Pr.program_id;
    `
    console.log(req.params['id']);

    dbClient.query(querystring)
        .then((results)=>{
            const post_data = results.rows[0];
            console.log(post_data);
            res.render(`post`, {
                post_title : post_data['title'],
                post_date : post_data['date'],
                post_content : post_data['content'],
                post_auth : post_data['teacher_id'],
            });
        })
        .catch((err)=>{
            console.error(err);
            res.redirect(`/`);
        })

    
})

module.exports = router;