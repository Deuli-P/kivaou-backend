INSERT $1
INTO users (email, password, firstname, lastname)
VALUES ($2, $3, $4, $5)
RETURNING email, id, firstname, lastname;