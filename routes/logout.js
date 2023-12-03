const express = require('express');
const router = express.Router();

router.get(`/`, (req, res, next)=>{
    if(req.session.user){
        req.session.destroy(err => {
            if (err) throw err;
            res.redirect(`/`); 
        });
    } else{
        res.render("alert", {error:"이미 로그아웃 상태입니다."});
    }
    
})

module.exports = router;