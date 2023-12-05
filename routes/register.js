const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);
const rd = require(`./register_category/register_disabled`);
const rp = require(`./register_category/register_parent`);
const rc = require(`./register_category/register_center`);
const rt = require(`./register_category/register_teacher`);
const rn = require(`./register_category/register_normal`);


async function check_user_category(post){
    if(post.user_category == 1){
        console.log(`장애인`);
        rd.disabled_register(post.is_parent, post.is_center, post.what_hobby, post.what_disabled, post.user_id)
    } else if(post.user_category == 2){
        console.log("보호자");
        rp.parent_register(post.ID_reg);
    } else if(post.user_category == 3){
        console.log("센터");
        let dis_data=[];
        for(let i=0; i<post.count_disabled; ++i){
            dis_data.push(post[`disabled_center_${i}`]);
        };
        console.log(dis_data);
        await rc.center_register(post.center_address,post.ID_reg, dis_data);
    } else if(post.user_category == 4){
        console.log("강사");
        rt.teacher_register(post.ID_reg);
    } else if(post.user_category == 5){
        console.log("일반사용자");
        rn.normal_register(post.ID_reg);
    }
    else{
        console.log("잘못 입력됨");
    }
}

router.get(`/`, (req,res)=>{
    if(req.session.user){
        res.render(`alert`, {error: "이미 로그인 하셨습니다."})
    }else{
        res.render(`register`);
    }
})


// 회원가입하는거
router.post(`/`, (req,res,next)=>{
    let body = ``;
    req.on('data', function (data) {
        body += data;
    });

    req.on('end', async function(){
        let post = qs.parse(body);
        if (req.session.dupreg != post.ID_reg) {
            res.render(`alert`, {error : `중복체크 후 회원가입 해주세요.`});
          } else {
            const querystring = 
                `insert into Account values ('${post.ID_reg}', '${post.PW_reg}', '${post.NAME_reg}', ${post.user_category});`;

            await dbClient
                .query(querystring)
                .then(() => {
                    console.log(querystring);
                })
                .then(()=>{
                    check_user_category(post);
                })
                .then(()=>{
                    req.session.destroy(err=>{
                        console.error(err);
                    });
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