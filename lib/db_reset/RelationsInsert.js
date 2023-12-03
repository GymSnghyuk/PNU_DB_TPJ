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
delete from ticketing;
delete from Program;
delete from Disabled;
delete from Center;
delete from Parent;
delete from Teacher;
delete from Account;
ALTER SEQUENCE teacher_teacher_ID_seq RESTART WITH 1;
ALTER SEQUENCE program_program_ID_seq RESTART WITH 1;
ALTER SEQUENCE disabled_disabled_ID_seq RESTART WITH 1;
ALTER SEQUENCE parent_parent_ID_seq RESTART WITH 1;
ALTER SEQUENCE normal_normal_ID_seq RESTART WITH 1;

insert into Account values ('Admin', 'cms3973', 'Admin', 0);
insert into Account values ('강사', '4', '강사', 4);
insert into Account values ('강사2', '4', '강사2', 4);
insert into teacher (certificated, user_ID) values ('false', '강사');
insert into teacher (certificated, user_ID) values ('false', '강사2');
insert into program (teacher_ID, category, title, content, count_max, count, date) values (1 ,'카테고리', '제목', '내용', 50, 0, '2023-12-31');

  `,
};
client
  .query(query)
  .then((res) => {
    client.end();
  })
  .catch((err) => console.error(err.stack));