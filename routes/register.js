const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);

router.get(`/`, (req,res)=>{
    res.render(`register`);
})
  
router.post(`/`, (req,res,next)=>{
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',function(){
        let post = qs.parse(body);
        console.log(post);

        const querystring = 
        `insert into Account values ('${post.ID_reg}', '${post.PW_reg}', '${post.NAME_reg}', ${post.user_category});`
        dbClient.query(querystring)
            .then((res) => {
            dbClient.end();
          })
          .catch((e) => console.error(e.stack));

        console.log(querystring);

        res.render(`login`);
    });
})


module.exports = router;