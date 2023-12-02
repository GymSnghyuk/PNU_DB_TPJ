const express = require('express');
const router = express.Router();
const qs = require(`querystring`);
const dbClient = require(`../lib/db`);



router.get(`/`, (req, res) => {
    if(req.session.user){
        res.render(`alert`, {error : "이미 로그인 하셨습니다."})
    } else {
        res.render(`login`);
    }
});


router.post(`/`, (req, res, next) => {
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',function(){
        let post = qs.parse(body);

        const querystring = 
            `
            SELECT A.user_id, A.name, A.user_category FROM account A
            WHERE A.user_id = '${post.ID_login}' 
                and A.password = '${post.PW_login}';
            `;

        dbClient
            .query(querystring)
            .then((ans)=> {
                if(ans.rowCount == 1) {
                    if (req.session.user) {
                        // 세션에 유저가 존재한다면
                        console.log("이미 로그인 돼있습니다~");
                        res.redirect(`/`)
                      } else {
                        req.session.user = {
                          id: post.ID_login,
                          name: ans.rows[0]['name'],
                          category: ans.rows[0][`user_category`],
                        };
                        res.redirect(`/`)
                      }
                }
                else{
                    res.render(`alert`, {error : '아이디 / 비밀번호가 맞지 않음'})
                    console.log(`아이디 / 비밀번호가 맞지 않음`)
                }
            })
            .catch((e) => {
                res.render(`alert`, {error : `오류`})
                console.error(e.stack)
            });
    });


    
});

module.exports = router;