CREATE OR REPLACE FUNCTION get_user_info_by_user_id(
    _user_id UUID
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _user_info JSONB;
BEGIN
    SELECT 
    json_build_object(
        'id', u.id, -- Spécifier l'id de la table users
        'firstname', u.firstname,
        'lastname', u.lastname,
        'email', a.email,
        'photo_path', u.photo_path,
        'organization', json_build_object(
            'id', org.id, -- Spécifier l'id de la table organizations
            'name', org.name
        )
    )
    INTO _user_info
    FROM users u
    LEFT JOIN auth a ON a.id = u.auth_id
    LEFT JOIN organizations org ON org.id = u.organization_id
    WHERE u.id = _user_id
    LIMIT 1;

    RETURN _user_info;
END;
$$;