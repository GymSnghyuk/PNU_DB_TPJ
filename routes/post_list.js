const express = require("express");
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/`, (req, res) => {
  if (req.session.user) {
    const querystring = `
        SELECT title, content, to_char(date, 'YYYY-MM-DD' ) as date, program_id
        FROM program
        ORDER BY program_id;
      `;

    dbClient
      .query(querystring)
      .then((ans) => {
        res.render("post_list", {
          posts: ans.rows,
          login: true,
        });
      })
      .catch((err) => {
        console.error(err);
        res.render(`alert`, { error: "오류났어" });
      });
  } else {
    res.redirect("/login"); // fhrmdlsdmfh
  }
});

module.exports = router;
