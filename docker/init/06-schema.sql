-- 06-schema.sql

INSERT INTO auth.users (email, password, role)
VALUES
  ('admin@luwak.local', 'HASH_DE_PASSWORD', 'auth_admin');
