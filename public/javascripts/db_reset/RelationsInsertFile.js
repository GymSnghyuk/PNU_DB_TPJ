const { Client } = require("pg");
const client = new Client({
  user: "kl_db2023",
  host: "localhost",
  database: "disabled2023",
  password: "dis2023!",
  port: 5432,
});
client.connect();
const query = {
  text: `
delete from Relationship;
delete from Take_center;
delete from Post;
delete from Program;
delete from Disabled;
delete from Center;
delete from Parent;
delete from Teacher;
delete from Account;

insert into Account values ('Admin', 'cms3973', 'Admin', 0);
  `,
};
client
  .query(query)
  .then((res) => {
    client.end();
  })
  .catch((err) => console.error(err.stack));
