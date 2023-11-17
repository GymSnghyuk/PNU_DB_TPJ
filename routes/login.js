const express = require('express');
const router = express.Router();
const qs = require(`querystring`);
const dbClient = require(`../lib/db`);



router.get(`/`, (req, res) => {
    res.render(`login`);
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
            SELECT A.user_id FROM account A
            WHERE A.user_id = '${post.ID_login}' 
                and A.password = '${post.PW_login}';
            `;

        dbClient
            .query(querystring)
            .then((ans)=> {
                if(ans.rowCount == 1) {
                    res.render(`login_user`);
                    console.log(`로그인 성공`);
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
