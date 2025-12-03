-- 0303-schema_role.sql

-- auth admin user - can bypass RLS
CREATE ROLE auth_admin NOLOGIN NOINHERIT;

GRANT USAGE ON SCHEMA auth TO auth_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth TO auth_admin;

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA auth TO auth_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA auth
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO auth_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA auth
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO auth_admin;

-- Grant bypass RLS privilege to auth admin
ALTER ROLE auth_admin BYPASSRLS;

GRANT auth_admin TO luwak_app;

-- schema user - must follow RLS, no direct access to auth tables
CREATE ROLE auth_user NOLOGIN NOINHERIT;

GRANT USAGE ON SCHEMA auth TO auth_user;

-- Grant permissions on all tables except auth tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth TO auth_user;

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA auth TO auth_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA auth
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO auth_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA auth
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO auth_user;

-- Remove permissions on auth tables (must go through RLS)
REVOKE ALL ON TABLE auth.users FROM auth_user;
REVOKE ALL ON TABLE auth.sessions FROM auth_user;
REVOKE ALL ON TABLE auth.refresh_tokens FROM auth_user;
REVOKE ALL ON TABLE auth.user_passcode FROM auth_user;

GRANT auth_user TO luwak_app;
