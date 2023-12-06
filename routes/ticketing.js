const express = require('express');
const router = express.Router();
const dbClient = require(`../lib/db`);
const qs = require(`querystring`);


// 신청페이지로 이동
router.get(`/:id`, async (req, res, next)=>{
    if(req.session.user){
        if(req.session.user.category != 4 && req.session.user.category != 5){
            
            // 신청하는 사람이 이미 신청했는지 확인 
            const check_ticketing = `
                SELECT *
                FROM ticketing
                WHERE program_id = ${req.params.id}
                    and user_id = '${req.session.user.id}';
            `;

            let check;
            await dbClient.query(check_ticketing)
                .then((results)=>{
                    check = results.rowCount;
                })
                .catch((err)=>{
                    console.error(err);
                });

            // 신청한 내역이 없으면
            if(check==0){
                // 현재 신청 인원 / 신청 가능 최대 인원 조회
                const querystring = `
                    SELECT count, count_max
                    FROM program
                    WHERE program_id = ${req.params.id};
                `;

                await dbClient.query(querystring)
                    .then((results)=>{
                        // 센터라면
                        if(req.session.user.category == 3){
                            const find_center_id_query = `
                                with cid as (
                                    SELECT center_id
                                    FROM center
                                    WHERE user_id = '${req.session.user.id}'    
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

                            dbClient.query(find_center_id_query)
                                    .then((ans)=>{
                                        res.render(`ticketing`,
                                        {count_current : results.rows[0].count, 
                                        count_max : results.rows[0].count_max,
                                        post_id : req.params.id,
                                        posts : ans.rows,
                                        });
                                    });
                        }
                        else{
                            res.render(`ticketing`,
                                {count_current : results.rows[0].count, 
                                count_max : results.rows[0].count_max,
                                post_id : req.params.id,
                                posts : null,
                                });
                        }
                        
                    })
                    .catch((err) => {
                        console.error(err);
                        render(`alert`, {error: "신청 실패. 오류"})
                    });

            } else{
                res.render(`alert`, {error: "이미 신청한 프로그램입니다."});
            }
        }
        else{
            res.render(`alert`, {error: "신청할 수 없는 사용자 입니다."})
        }

    } else{
        res.render("alert", {error:"로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요."});
    }
})


// 신청하기
router.post(`/:id`, (req, res, next)=>{
    if(req.session.user){
        let body = ``;
        req.on('data', function (data) {
            body += data;
        });
    
        req.on('end', async function(){        
            let post = await qs.parse(body);
            let check = false;

            const max_check_query = `
                SELECT count_max, count
                FROM program
                WHERE program_id = ${req.params.id};
            `;

            await dbClient.query(max_check_query)
                .then((results)=>{
                    const count_cur_q = results.rows[0]["count"];
                    const count_max_q = results.rows[0]["count_max"];
                    if(count_max_q >= count_cur_q + post.howmany && post.howmany > 0){
                        check = true
                    }
                })
                .catch((err)=>{
                    console.error(err);
                    res.render(`alert`, {error: "인원 체크 중 오류 발생"});
                });

            if(check){
                const updatequery = `
                    UPDATE program 
                    SET count=count + ${post.howmany}
                    WHERE program_id = ${req.params.id};
                `;

                await dbClient.query(updatequery)
                    .then((results)=>{
                        console.log("program 테이블 count 업데이트 성공");
                    })
                    .catch((err)=>{
                        console.error(err);
                        res.render(`alert`, {error: "DB에 count 업데이트 못했음"});
                    })

                const querystring = `
                    INSERT INTO ticketing VALUES (${req.params.id}, '${req.session.user.id}',${post.howmany});
                `;

                await dbClient.query(querystring)
                    .then((results)=>{
                        console.log("신청 성공");
                        res.redirect(`/post/${req.params.id}`);
                    })
                    .catch((err)=>{
                        console.error(err);
                        res.render(`alert`, {error: "count 업데이트 후 "})
                    })
            } else {
                res.render(`alert`, {error: "신청할 수 없습니다. 인원 정보를 확인하세요."});
            }

            
            
        });
    }
    else{
        res.render(`alert`, {error: "로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요."});
    }
});


// 신청 취소
router.post(`/delete/:pid/:howmany`, async (req,res,next)=>{
    if(req.session.user){
        const cancelquery = `
            UPDATE program 
            SET count=count - ${req.params.howmany}
            WHERE program_id = ${req.params.pid};
        `;

        await dbClient.query(cancelquery)
            .then((results)=>{
                console.log(`count 감소 성공`)
            })
            .catch((err)=>{
                console.error(err);
            })
        const querystring = `
            DELETE FROM ticketing
            WHERE program_id = ${req.params.pid}
                and user_id = '${req.session.user.id}'
        `;

        await dbClient.query(querystring)
            .then((results)=>{
                console.log(`DELETE 성공`);
                res.redirect(`/mypage`);
            })
            .catch((err)=>{
                console.error(err);
            })
    } else{
        res.render(`alert`, {error : "로그인 정보 확인 불가"});
    }
})

module.exports = router;