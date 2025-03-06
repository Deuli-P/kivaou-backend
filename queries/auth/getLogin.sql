SELECT email, id, password, firstname, lastname
FROM users
WHERE email = $1
LIMIT 1;