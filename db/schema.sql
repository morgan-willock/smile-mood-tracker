CREATE DATABASE smile;

create table users (
    id serial primary key NOT NULL,
    email varchar(255) NOT NULL unique,
    hash text NOT NULL
);

create table moods (
    id INTEGER NOT NULL,
    input_date DATE NOT NULL,
    mood_selection SMALLINT NOT NULL,
    activities TEXT[]
);

-- test insert into users table
insert into users
(email, hash)
values
('test', 'test'
);

-- test insert into moods table
insert into moods
values
(1, '1988/09/10', 0, '{"cycling", "friends", "relaxing"}');

-- set moods table to SQL, DMY date. DD-MM-YYYY 
set DateStyle='SQL, DMY';

-- return t if exists else returns false
 SELECT EXISTS (SELECT true FROM users WHERE email = 'test@test.com');

-- test users have password of test