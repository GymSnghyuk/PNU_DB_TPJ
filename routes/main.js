const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/`, (req, res) => {
    if (req.session.user) {
      const querystring = `
        SELECT title, content, date, post_id
        FROM post;
      `

      dbClient.query(querystring)
        .then((ans)=>{
          res.render("main_view", {
            userid:req.session.user.id,
            username: req.session.user.name,
            posts: ans.rows,
            }); 
        })
        .catch((err)=>{
          console.error(err);
          res.render(`alert`, {error: "오류났어"});
        })
    } else {
      res.redirect("/login"); // fhrmdlsdmfh
    }
  });


module.exports = router;