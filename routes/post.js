const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/:id`, (req, res, next)=>{
    if (req.session.user) {
        const querystring = `
        SELECT title, Po.date, Po.content, Pr.teacher_id
        FROM post Po, program Pr
        WHERE Po.post_id = ${req.params['id']} 
            and Po.program_id = Pr.program_id;
    `
    console.log(req.params['id']);

    dbClient.query(querystring)
        .then((results)=>{
            const post_data = results.rows[0];
            res.render(`post`, {
                post_title : post_data['title'],
                post_date : post_data['date'],
                post_content : post_data['content'],
                post_auth : post_data['teacher_id'],
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

module.exports = router;