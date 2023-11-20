const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const expressSession = require(`express-session`);

router.use(
    expressSession({
      secret: "my key",
      resave: true,
      saveUninitialized: true,
    })
);

router.get(`/`, (req, res) => {
    if (req.session.user) {
      // 세션에 유저가 존재한다면
      res.render("/main"); // 예시로
    } else {
      res.redirect("/login"); // fhrmdlsdmfh
    }
  });


module.exports = router;