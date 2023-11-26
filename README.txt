Express 활용 nodejs 기반 데이터베이스 postgreSQL 텀프로젝트


PNU_DB_TBJ
    L lib
        L db_reset : 데이터베이스 reset 파일 폴더
        L db.js : postgres module
    L public : client에도 쓸 수 있는 것들
        L images
        L javascripts
        L stylesheets
    L routes : 라우터
    L views : views - ejs파일 형식

    



postgreSQL 설정
1. postgres=# CREATE USER KL_db2023 WITH ENCRYPTED PASSWORD 'dis2023!';
2. postgres=# CREATE TABLESPACE tspace_db2023 OWNER KL_db2023 LOCATION '테이블스페이스 경로';
3. postgres=# CREATE DATABASE disabled2023 OWNER KL_db2023 TABLESPACE ts_db2023 ;

VScode에서 postgres 작업하기
1. extend 에서 postgreSQL 설치
2. + 누르고 정보 입력
    ex. localhost, KL_db2023, dis2023!, ... , disabled2023

출처 : https://frdmglo.tistory.com/entry/vscode-postgresql-%EC%97%B0%EB%8F%99-%EC%BF%BC%EB%A6%AC-%EC%8B%A4%ED%96%89-%EB%B0%A9%EB%B2%95