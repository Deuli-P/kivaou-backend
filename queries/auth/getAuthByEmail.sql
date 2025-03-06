SELECT id, password, email
FROM auth
WHERE email = $1
LIMIT 1;