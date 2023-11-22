const express = require(`express`);

const indexrouter = require(`./routes/index`);
const loginrouter = require(`./routes/login`);
const registerrouter = require(`./routes/register`);

const app = express();
app.set(`port`, process.env.PORT || 3000);
app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`);

app.use(`/script`, express.static(__dirname + "/public/javascripts"));
app.use(`/css`, express.static(__dirname + "/public/stylesheets"));

app.use(`/`, indexrouter);
app.use(`/login`, loginrouter);
app.use(`/register`, registerrouter);




app.listen(app.get('port'), () => {
  console.log(`Example app listening on port ${app.get('port')}`);
});
