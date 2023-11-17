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
  drop table if exists Relationship;
drop table if exists Take_center;
drop table if exists Post;
drop table if exists Program;
drop table if exists Disabled;
drop table if exists Center;
drop table if exists Parent;
drop table if exists Teacher;
drop table if exists Account;


create table Account
	(user_ID		varchar(12),
	 password		varchar(15),
	 name		    varchar(15),
     user_category  numeric(1,0),
	 primary key (user_ID)
	);

create table Disabled
    (disabled_ID    int,
    name            varchar(15),
    is_parent       boolean,
    is_center       boolean,
    hobby           varchar(20),
    kind_of_disabled    varchar(30),
    user_ID         varchar(12),
    primary key (disabled_ID),
    foreign key (user_ID) references account
        on delete cascade
    );

create table Parent
    (parent_ID      int,  
     name           varchar(15),
     user_ID        varchar(12),
     primary key(parent_id),
     foreign key (user_ID) references account
        on delete cascade
     );

create table Center
    (center_ID      int,  
     name           varchar(15),
     address        varchar(30),
     certificated   boolean,
     user_ID        varchar(12),
     primary key(center_id),
     foreign key (user_ID) references account
        on delete cascade
     );

create table Teacher
    (teacher_ID      int,  
     name           varchar(15),
     certificated   boolean,
     user_ID        varchar(12),
     primary key(teacher_id),
     foreign key (user_ID) references account
        on delete cascade
     );

create table Program
    (program_ID     int,
    teacher_ID      int,
    category        varchar(15),
    date            date,
    time            time,
    primary key (program_ID),
    foreign key (teacher_ID) references Teacher
        on delete cascade
    );

create table Post
    (post_ID        int,
    program_ID      int,
    title           varchar(40),
    content         varchar(1000),
    date            date,
    time            time,
    primary key (post_ID),
    foreign key (program_ID) references Program
        on delete cascade
    );



create table Take_center
    (center_ID      int,
    disabled_ID     int,
    foreign key (center_ID) references Center
        on delete CASCADE,
    foreign key (disabled_ID) references disabled
        on delete CASCADE
    );

create table Relationship
    (parent_ID      int,
    disabled_ID     int,
    foreign key (parent_ID) references Center
        on delete CASCADE,
    foreign key (disabled_ID) references disabled
        on delete CASCADE
    );
  `,
};
client
  .query(query)
  .then((res) => {
    client.end();
  })
  .catch((err) => console.error(err.stack));
