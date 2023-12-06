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
insert into Account values ('장애인', '1', '장애인', 1);
insert into Account values ('장애인2', '1', '장애인2', 1);
insert into Account values ('보호자', '2', '보호자', 2);
insert into Account values ('보호자2', '2', '보호자2', 2);
insert into Account values ('센터', '3', '센터', 3);
insert into Account values ('센터2', '3', '센터2', 3);
insert into Account values ('강사', '4', '강사', 4);
insert into Account values ('강사2', '4', '강사2', 4);
insert into Account values ('일반', '5', '일반', 5);
insert into Account values ('일반2', '5', '일반2', 5);
insert into disabled values (0, false, false, '관리자', '관리자', 'Admin');
insert into disabled values (1, false, false, '운동', '왼팔장애', '장애인');
insert into disabled values (2, false, false, '음악', '오른 다리 절단', '장애인2');
insert into parent values (0, 'Admin');
insert into parent values (1, '보호자');
insert into parent values (2, '보호자2');
insert into center values (0, '관리자', true, 'Admin');
insert into center values (1, '부산 장전동 센터', true, '센터');
insert into center values (2, '부산 사직동 센터', true, '센터2');
insert into teacher values (0, true, 'Admin');
insert into teacher (certificated, user_ID) values ('false', '강사');
insert into teacher (certificated, user_ID) values ('false', '강사2');
insert into normal values (0, 'Admin');
insert into normal values (1, '일반');
insert into normal values (2, '일반2');
insert into program (teacher_ID, category, title, content, count_max, count, date) values (1 ,'운동', '헬스하자', '헬스할 사람', 50, 0, '2023-12-29');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (2 ,'음악', '노래듣자', '노래들을 사람', 50, 0, '2023-12-31');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (1 ,'미술', '그림그리자', '그림 그릴 사람?', 50, 0, '2023-12-15');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (1 ,'독서', '책읽자', '책 읽을 사람', 50, 0, '2023-12-17');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (2 ,'영화 감상', '영화보자', '영화 보러 갈 사람', 50, 0, '2023-12-18');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (2 ,'게임', '게임하러가자', '게임 할 사람', 50, 0, '2023-12-16');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'음악', '노래부르자', '노래 부를 사람', 50, 0, '2023-12-22');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'영화', '영화 또 보자', '영화 또 볼 사람', 50, 0, '2023-12-28');
insert into program  (teacher_ID, category, title, content, count_max, count, date) values (0 ,'운동', '크로스핏 하자', '크로스핏 할 사람', 50, 0, '2023-12-31');
insert into take_center values (0, 1);
insert into take_center values (0, 2);
insert into take_center values (1, 1);
insert into take_center values (1, 2);
insert into take_center values (2, 1);
insert into relationship values (0, 1);
insert into relationship values (0, 2);
insert into relationship values (1, 1);
insert into relationship values (2, 2);
insert into relationship values (2, 1);

  `,
};
client
  .query(query)
  .then((res) => {
    client.end();
  })
  .catch((err) => console.error(err.stack));