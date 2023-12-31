const express = require("express");
const router = express.Router();
const dbClient = require(`../lib/db`);

router.get(`/`, async (req, res, next) => {
  if (!req.session.user) {
    res.redirect(`/login`);
  } else {
    const querystring = `
                SELECT *
                FROM account A
                WHERE A.user_id = '${req.session.user.id}';
            `;

    let data = {};

    await dbClient
      .query(querystring)
      .then((ans) => {
        data = {
          id: ans.rows[0]["user_id"],
          name: ans.rows[0]["name"],
          user_category: ans.rows[0]["user_category"],
        };
      })
      .catch((err) => {
        console.error(`mypage 오류발생`);
      });

    // 강사 이거나 관리자일 경우
    if (req.session.user.category == 4 || req.session.user.category == 0) {
      const querystr = `
                with findteacherid as (
                    SELECT teacher_id
                    FROM teacher
                    WHERE user_id = '${req.session.user.id}'
                )
                SELECT P.title, P.date, P.program_id, P.count as howmany
                FROM findteacherid F, program P
                WHERE F.teacher_id = P.teacher_id
                ;
            `;

      await dbClient
        .query(querystr)
        .then((ans) => {
          res.render(`mypage`, {
            id: data.id,
            name: data.name,
            user_category: data.user_category,
            posts: ans.rows,
            hidden_ticketing: "나의 게시 목록",
            cancel_hidden: "",
            login: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.render(`alert`, { error: "게시 목록 불러오기 실패" });
        });
    } else {
      const querystr = `
                SELECT P.title, P.date, T.howmany, P.program_id
                FROM ticketing T, program P
                WHERE T.user_id = '${req.session.user.id}' and
                    P.program_id = T.program_id;
            `;

      await dbClient
        .query(querystr)
        .then((ans) => {
          res.render(`mypage`, {
            id: data.id,
            name: data.name,
            user_category: data.user_category,
            posts: ans.rows,
            hidden_ticketing: "나의 신청 목록",
            cancel_hidden: "신청 취소",
            login: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.render(`alert`, { error: "여기서 버그걸릴수도 있음" });
        });
    }
  }
});

router.get(`/disabled/:category/:id`, (req, res, next) => {
  if (req.session.user) {
    const category = req.params.category;
    const userid = req.params.id;

    if (category == 2 || category == 0) {
      const find_parent_id_query = `
                with pid as (
                    SELECT parent_id
                    FROM parent
                    WHERE user_id = '${userid}'    
                ),
                did as(
                    SELECT disabled_id
                    FROM Relationship R, pid P
                    WHERE R.parent_id = P.parent_id
                )
                SELECT A.user_id, A.name
                FROM disabled D, did, account A
                WHERE D.disabled_id = did.disabled_id and A.user_id = D.user_id;
        
            `;

      dbClient.query(find_parent_id_query).then((results) => {
        console.log(results.rows);
        res.render(`disabled`, { posts: results.rows });
      });
    } else if (category == 3) {
      const find_center_id_query = `
                with cid as (
                    SELECT center_id
                    FROM center
                    WHERE user_id = '${userid}'    
                ),
                did as(
                    SELECT disabled_id
                    FROM take_center T, cid C
                    WHERE T.center_id = C.center_id
                )
                SELECT A.user_id, A.name
                FROM disabled D, did, account A
                WHERE D.disabled_id = did.disabled_id and A.user_id = D.user_id;
            `;

      dbClient.query(find_center_id_query).then((results) => {
        console.log(results.rows);
        res.render(`disabled`, { posts: results.rows });
      });
    }
  }
});

module.exports = router;
