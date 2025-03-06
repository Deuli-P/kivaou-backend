CREATE TABLE IF NOT EXISTS auth (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP,
  email TEXT,
  user_type user_type,
  password TEXT
);
