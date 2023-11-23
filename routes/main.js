const express = require('express');
const router = express.Router();

router.get(`/`, (req, res) => {
    if (req.session.user) {
      // 세션에 유저가 존재한다면
      res.render("main_view", {userid:req.session.user.id, username: req.session.user.name}); // 예시로
    } else {
      res.redirect("/login"); // fhrmdlsdmfh
    }
  });


module.exports = router;