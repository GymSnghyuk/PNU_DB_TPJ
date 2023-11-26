const express = require('express');
const router = express.Router();

router.post(`/`, (req, res, next)=>{
    req.session.destroy(err => {
            if (err) throw err;
            res.redirect(302, '/'); // 웹페이지 강제 이동 
        });
})

module.exports = router;