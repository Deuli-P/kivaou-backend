INSERT $1
INTO users (email, password, firstname, lastname, photo_path)
VALUES ($2, $3, $4, $5, $6)
RETURNING email, id, firstname, lastname, photo_path; 