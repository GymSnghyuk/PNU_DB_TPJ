Express 활용 nodejs 기반 데이터베이스 postgreSQL 텀프로젝트

명령어 (npm)
$ npm start
$ npm run dev       (개발용 / nodemon) - 디버깅할땐 이거로 하자.
$ npm run db_reset  (db 리셋)




postgreSQL 설정
1. postgres=# CREATE USER KL_db2023 WITH ENCRYPTED PASSWORD 'dis2023!';
2. postgres=# CREATE TABLESPACE tspace_db2023 OWNER KL_db2023 LOCATION '테이블스페이스 경로';
3. postgres=# CREATE DATABASE disabled2023 OWNER KL_db2023 TABLESPACE ts_db2023 ;

VScode에서 postgres 작업하기
1. extend 에서 postgreSQL 설치
2. + 누르고 정보 입력
    ex. localhost, KL_db2023, dis2023!, ... , disabled2023

출처 : https://frdmglo.tistory.com/entry/vscode-postgresql-%EC%97%B0%EB%8F%99-%EC%BF%BC%EB%A6%AC-%EC%8B%A4%ED%96%89-%EB%B0%A9%EB%B2%95