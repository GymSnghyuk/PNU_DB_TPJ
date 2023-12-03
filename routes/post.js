const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/:id`,async (req, res, next)=>{
    if (req.session.user) {

        const find_teacher_id_query = `
            SELECT A.name
            FROM teacher T, account A
            WHERE T.user_id = A.user_id;
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
                    post_date : post_data['date'],
                    post_content : post_data['content'],
                    post_auth : auth,
                    post_category : post_data['category'],
                    post_count_max : post_data['count_max'],
                    post_count : post_data['count'],
                    post_date : post_data['date'],
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