CREATE DATABASE smile;

create table users (
    id serial primary key NOT NULL,
    email varchar(255) NOT NULL unique,
    hash text NOT NULL
);

insert into users
(email, hash)
values
('test', 'test'
);

-- return t if exists else returns false
 SELECT EXISTS (SELECT true FROM users WHERE email = 'test@test.com');

-- test users have password of test