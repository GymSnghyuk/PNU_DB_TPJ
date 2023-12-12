const express = require("express");
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);

router.get(`/`, (req, res, next) => {
    if(req.session.user){
        if (req.session.user.category == 4 || req.session.user.category == 0) {
            res.render(`write`, { login: true });
          } else {
            res.render(`alert`, { error: "게시 권한이 없습니다." });
          }
    }
    else {
        res.render(`alert`, {error: "세션 만료. 재로그인 해주세요."});
    }
});

router.post(`/`, (req, res, next) => {
  if (!req.session.user) {
    res.render(`alert`, { error: "잘못된 접근입니다." });
  } else {
    let body = ``;
    req.on("data", function (data) {
      body += data;
    });

    req.on("end", async function () {
      // 사용자가 강사일 경우
      if (req.session.user.category == 4) {
        let post = qs.parse(body);
        const userid = req.session.user.id;

        const find_teacher_id_query = `
                    SELECT teacher_id
                    FROM teacher
                    WHERE user_id = '${userid}';
                `;

        let teacher_id;
        await dbClient
          .query(find_teacher_id_query)
          .then((results) => {
            teacher_id = results.rows[0].teacher_id;
            console.log(teacher_id);
          })
          .catch((err) => {
            console.error(err);
            res.render(`alert`, { error: `오류 : teacher_id를 찾지 못함` });
          });

        const querystring = `
                    insert into program (teacher_id, category, title, content, count_max, date)
                    values (${teacher_id},'${post.category}', '${post.title}','${post.content}',${post.count_max},'${post.date}');
                `;

        await dbClient
          .query(querystring)
          .then((results) => {
            res.redirect(`/postlist`);
          })
          .catch((err) => {
            console.error(err);
            res.render(`alert`, { error: `오류 : 게시글 등록 안됨` });
          });
        // 관리자일 경우
      } else if (req.session.user.category == 0) {
        let post = qs.parse(body);

        const querystring = `
                    insert into program (teacher_id, category, title, content, count_max, date)
                    values (0,'${post.category}', '${post.title}','${post.content}',${post.count_max},'${post.date}');
                `;

        await dbClient
          .query(querystring)
          .then((results) => {
            res.redirect(`/postlist`);
          })
          .catch((err) => {
            console.error(err);
            res.render(`alert`, { error: `오류 : 게시글 등록 안됨` });
          });
      } else {
        res.render(`alert`, { error: "접근 권한이 없습니다." });
      }
    });
  }
});

module.exports = router;
