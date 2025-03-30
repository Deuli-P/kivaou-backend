CREATE TABLE IF NOT EXISTS auth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP,
  email TEXT,
  user_type user_type,
  password TEXT
);
