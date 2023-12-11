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
insert into disabled values (0, false, false, '관리자', '관리자', 'Admin');
insert into parent values (0, 'Admin');
insert into center values (0, '관리자', true, 'Admin');
insert into teacher values (0, true, 'Admin');
insert into normal values (0, 'Admin');
insert into program (teacher_ID, category, title, content, count_max, count, date) values (0 ,'운동', '헬스하자', '헬스할 사람', 50, 0, '2023-12-29');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'음악', '노래듣자', '노래들을 사람', 50, 0, '2023-12-31');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'미술', '그림그리자', '그림 그릴 사람?', 50, 0, '2023-12-15');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'독서', '책읽자', '책 읽을 사람', 50, 0, '2023-12-17');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'영화 감상', '영화보자', '영화 보러 갈 사람', 50, 0, '2023-12-18');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'게임', '게임하러가자', '게임 할 사람', 50, 0, '2023-12-16');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'음악', '노래부르자', '노래 부를 사람', 50, 0, '2023-12-22');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'영화', '영화 또 보자', '영화 또 볼 사람', 50, 0, '2023-12-28');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'운동', '크로스핏 하자', '크로스핏 할 사람', 50, 0, '2023-12-31');

  `,
};
client
  .query(query)
  .then((res) => {
    client.end();
  })
  .catch((err) => console.error(err.stack));