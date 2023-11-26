const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);
const cookieParser = require("cookie-parser");
const expressSession = require(`express-session`);
const rd = require(`./register_category/register_disabled`);
const rp = require(`./register_category/register_parent`);
const rc = require(`./register_category/register_center`);
const rt = require(`./register_category/register_teacher`);

router.use(cookieParser());

// 세션 설정
router.use(
  expressSession({
    secret: "my key",
    resave: true,
    saveUninitialized: true,
  })
);

function check_user_category(name,user_id,user_category){
    if(user_category == 1){
        console.log(`장애인`);
        rd.disabled_register(name, false, false, `축구`, `왼팔장애`, user_id)
    } else if(user_category == 2){
        console.log("보호자");
        rp.parent_register(name,user_id);
    } else if(user_category == 3){
        console.log("센터");
        rc.center_register(name,"부산시 금정구",user_id);
    } else if(user_category == 4){
        console.log("강사");
        rt.teacher_register(name, user_id);
    } else {
        console.log("잘못 입력됨");
    }
}

router.get(`/`, (req,res)=>{
    res.render(`register`);
})


// 회원가입하는거
router.post(`/`, (req,res,next)=>{
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',function(){
        let post = qs.parse(body);
        if (req.session.dupreg != post.ID_reg) {
            res.render(`alert`, {error : `중복체크 후 회원가입 해주세요.`});
          } else {
            const querystring = 
                `insert into Account values ('${post.ID_reg}', '${post.PW_reg}', '${post.NAME_reg}', ${post.user_category});`;

            dbClient
                .query(querystring)
                .then(() => {
                    console.log(querystring);
                })
                .then(()=>{
                    check_user_category(post.NAME_reg, post.ID_reg, post.user_category);
                })
                .then(()=>{
                    res.redirect(`/`);
                })
                .catch((e) => {
                    res.render(`alert`, {error : `가입정보를 다시 확인하세요.`})
                    console.error(e.stack)
                })
            }
    });
})

// 중복체크
router.get(`/dup_chk`,(req,res,next)=>{
    res.render(`id_dup_check`);
})

router.post(`/dup_chk`,(req,res,next)=>{
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end',function(){
        let post = qs.parse(body);

        const querystring = 
            `SELECT * FROM account A WHERE A.user_id = '${post.dup_id}';`;

        dbClient
            .query(querystring)
            .then((ans) => {
                if(ans.rowCount == 1){
                    res.render(`alert`, {error : "중복된 아이디"});
                }
                else if(post.dup_id.length > 15){
                    res.render(`alert`, {error : `너무길어`});
                }
                else{
                    req.session.dupreg = post.dup_id;
                    console.log("세션에 중복체크한거 등록");
                    res.render(`alert`, {error : `가입가능한 이이디입니다.`});
                }
            })
            .catch((e) => {
                res.render(`alert`, {error : `오류`})
            })
        
    });
})


module.exports = router;