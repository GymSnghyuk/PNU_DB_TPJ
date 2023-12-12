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
ALTER SEQUENCE center_center_ID_seq RESTART WITH 1;
ALTER SEQUENCE parent_parent_ID_seq RESTART WITH 1;
ALTER SEQUENCE normal_normal_ID_seq RESTART WITH 1;

insert into Account values ('장애인1', '1', '장애인1', 1);
insert into Account values ('장애인2', '1', '장애인2', 1);
insert into Account values ('장애인3', '1', '장애인3', 1);
insert into Account values ('장애인4', '1', '장애인4', 1);
insert into Account values ('보호자', '2', '보호자', 2);
insert into Account values ('센터', '3', '센터', 3);
insert into Account values ('강사', '4', '강사', 4);
insert into Account values ('일반사용자', '5', '일반사용자', 5);
insert into disabled (is_parent, is_center, hobby, kind_of_disabled, user_id) VALUES (true, false, 'workout', '왼팔장애', '장애인1');
insert into disabled (is_parent, is_center, hobby, kind_of_disabled, user_id) VALUES (true, true, 'music', '지체장애', '장애인2');
insert into disabled (is_parent, is_center, hobby, kind_of_disabled, user_id) VALUES (false, true, 'art', '발달장애', '장애인3');
insert into disabled (is_parent, is_center, hobby, kind_of_disabled, user_id) VALUES (false, true, 'workout', '왼발장애', '장애인4');
insert into parent (user_id) values ('보호자');
insert into center (address, certificated, user_id )values ('부산 금정구 센터', true, '센터');
insert into teacher (certificated, user_id) values (true, '강사');
insert into normal (user_id) values ('일반사용자');
insert into program (teacher_ID, category, title, content, count_max, count, date) values (1 ,'workout', '헬스하자', '헬스할 사람', 50, 0, '2023-12-29');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (1 ,'music', '노래듣자', '노래들을 사람', 50, 0, '2023-12-31');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (1 ,'art', '그림그리자', '그림 그릴 사람?', 50, 0, '2023-12-15');
insert into relationship values (1,1);
insert into relationship values (1,2);
insert into take_center values (1,2);
insert into take_center values (1,3);
insert into take_center values (1,4);


  `,
};
client
  .query(query)
  .then((res) => {
    client.end();
  })
  .catch((err) => console.error(err.stack));