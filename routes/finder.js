const express = require("express");
const router = express.Router();
const qs = require(`querystring`);
const dbClient = require(`../lib/db`);

router.get(`/`, (req, res, next) => {
  if (req.session.user) {
    res.render(`finder`, { login: true });
  } else {
    res.render(`alert`, { error: "로그인 후 이용하세요." });
  }
});

//검색단어 입력 후 검색버튼 누르면

router.post(`/`, (req, res, next) => {
  let body = ``;
  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    let post = qs.parse(body);

    const querystring = `
                SELECT title, content, to_char(date, 'YYYY-MM-DD' ) as date, program_id
                FROM program P
                WHERE P.title LIKE '%${post.findkey}%'
                ORDER BY program_id;;
            `;

    dbClient
      .query(querystring)
      .then((ans) => {
        if ((post.findkey = null)) {
          res.render("alert", { error: "검색어를 입력하세요." });
        } else if (ans.rowCount == 0) {
          res.render("post_list", {
            posts: [{ post_id: "검색어를 찾을 수 없습니다." }],
            login: true,
          });
        } else {
          res.render("post_list", {
            posts: ans.rows,
            login: true,
          });
        }
      })
      .catch((e) => {
        res.render(`alert`, { error: `오류` });
        console.error(e.stack);
      });
  });
});

module.exports = router;
