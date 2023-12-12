const express = require("express");
const router = express.Router();
const dbClient = require(`../lib/db`);

/* GET home page. */
const empty_posts = [{}];

router.get(`/`, (req, res) => {
  if (req.session.user) {
    if (req.session.user.category == 1) {
      const querystring = `
                with dis_hobby as (
                    SELECT hobby
                    FROM disabled
                    WHERE user_id = '${req.session.user.id}'
                )
                SELECT P.program_id, to_char(P.date, 'YYYY-MM-DD' ) as date, P.title
                FROM program P, dis_hobby D
                WHERE P.category = D.hobby
                ORDER BY P.program_id;
            `;

      dbClient
        .query(querystring)
        .then((results) => {
          res.render(`index`, {
            posts: results.rows,
            hidden_div: 1,
            login: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.render(`alert`, { error: "오류났어요" });
        });
    } else if (req.session.user.category == 4) {
      const querystring = `
        with tid as (
          SELECT teacher_id
          FROM teacher
          WHERE user_id = '${req.session.user.id}'
        )
        SELECT *
        FROM program P, tid T
        WHERE P.teacher_id = T.teacher_id;
      `;

      dbClient
        .query(querystring)
        .then((results) => {
          res.render(`index`, {
            posts: results.rows,
            hidden_div: 4,
            login: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.render(`alert`, { error: "오류났어요" });
        });
    } else {
      res.render(`post_list`, {
        posts: empty_posts,
        hidden_div: -1,
        login: true,
      });
    }
  } else {
    res.render(`index`, {
      posts: empty_posts,
      hidden_div: -1,
      login: false,
    });
  }
});

module.exports = router;
