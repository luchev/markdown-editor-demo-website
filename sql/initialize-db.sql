--Initialize DB and user
CREATE ROLE md_user ENCRYPTED PASSWORD 'PASSWORD';
CREATE DATABASE md_db WITH OWNER md_user;
GRANT ALL ON DATABASE md_db TO md_user;

-- Change owner
ALTER TABLE users OWNER TO md_user;

-- Add citext type to use for email
CREATE EXTENSION citext;

--Create table for user registration
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email citext UNIQUE,
    pass VARCHAR(255),
    display_name VARCHAR(40),
    CONSTRAINT id PRIMARY KEY  
);

CREATE TABLE loggedin(
    user_id int PRIMARY KEY,
    token VARCHAR(255) UNIQUE,
    created TIMESTAMP,
    expires TIMESTAMP
);
