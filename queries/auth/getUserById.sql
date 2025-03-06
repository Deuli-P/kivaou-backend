SELECT 
    u.id,
    u.email, 
    u.firstname, 
    u.lastname, 
    u.photo_path,
    u.organisation_id AS organization_id,
    a.email,
    org.name AS organization_name
FROM users u
LEFT JOIN auth a ON users.auth_id = auth.id
LEFT JOIN organizations org ON users.organisation_id = org.id
WHERE id = $1
LIMIT 1;