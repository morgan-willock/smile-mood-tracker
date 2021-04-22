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
