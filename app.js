const express = require(`express`);
const cookieParser = require("cookie-parser");
const expressSession = require(`express-session`);
const indexrouter = require(`./routes/index`);
const loginrouter = require(`./routes/login`);
const registerrouter = require(`./routes/register`);
const postlistrouter = require(`./routes/post_list`);
const logoutrouter = require(`./routes/logout`);
const postrouter = require(`./routes/post`);
const findrouter = require(`./routes/finder`);
const mypagerouter = require(`./routes/mypage`);
const writepostrouter = require(`./routes/writepost`);


const app = express();

app.set(`port`, process.env.PORT || 3000);
app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`);

app.use(cookieParser());
app.use(expressSession({
  // secure: ture,	// https 환경에서만 session 정보를 주고받도록처리
  secret: "my key", // 암호화하는 데 쓰일 키
  resave: false, // 세션을 언제나 저장할지 설정함
  saveUninitialized: true, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
    Secure: true
  },
  name: 'session-cookie' // 세션 쿠키명 디폴트값은 connect.sid이지만 다른 이름을 줄수도 있다.
}));

app.use(`/script`, express.static(__dirname + "/public/javascripts"));
app.use(`/css`, express.static(__dirname + "/public/stylesheets"));
app.use(`/img`, express.static(__dirname + "/public/images"));


app.use(`/`, indexrouter);
app.use(`/finder`, findrouter);
app.use(`/login`, loginrouter);
app.use(`/register`, registerrouter);
app.use(`/postlist`, postlistrouter);
app.use(`/logout`, logoutrouter);
app.use(`/post`,postrouter);
app.use(`/mypage`,mypagerouter);
app.use(`/write`, writepostrouter);

app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`);
});
