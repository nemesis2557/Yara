-- 04-db_connector.sql

-- database connection user
CREATE ROLE luwak_app LOGIN PASSWORD 'luwak_app_pass';

ALTER ROLE luwak_app NOINHERIT;

REVOKE CONNECT ON DATABASE luwak_db FROM PUBLIC;

GRANT CONNECT ON DATABASE luwak_db TO luwak_app;
