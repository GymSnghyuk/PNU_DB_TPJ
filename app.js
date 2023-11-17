const express = require(`express`);
// const path = require(`path`);
const {dbClient} = require("./routes/postgresql");
const qs = require(`querystring`);


const app = express();
app.set(`port`, process.env.PORT || 3000);

// use(미들웨어) 테스트
app.use((req, res, next) => {
  console.log(`모든 요청에 대해 실행됨`);
  next();
});

app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`);


app.get(`/`, (req, res) => {
    res.render(`index`);
});

app.get(`/login`, (req, res) => {
    res.render(`login`);
});

app.get(`/register`, (req,res)=>{
  res.render(`register`);
})

app.post(`/register`, (req,res,next)=>{
  let body = ``;
  req.on('data', function (data) {
    body += data;
  });
  req.on('end',function(){
    let post = qs.parse(body);    //body의 내용이 { title: 'd', description: 'd' }
    console.log(post.ID_reg);     //와 같이 딕셔너리 형태로 저장된다
    console.log(post);

    const querystring = 
    `insert into Account values ('ksh', '973', 'Amin', 0);`
    dbClient.query(querystring);
    console.log(querystring);

    res.render(`login.ejs`);
  });
})

app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`);
});
