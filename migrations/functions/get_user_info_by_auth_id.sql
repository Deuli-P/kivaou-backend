CREATE OR REPLACE FUNCTION get_user_info_by_auth_id(
    _auth_id UUID
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
        'id', u.id,
        'firstname', u.firstname,
        'lastname', u.lastname,
        'email', auth.email,
        'photo_path', u.photo_path,
        'user_type', auth.user_type,
        'organization', json_build_object(
            'id', org.id, 
            'name', org.name,
            'role', CASE 
                WHEN org.owner_id = u.id THEN 'OWNER'
                ELSE 'MEMBER'
            END
        )
    )
    INTO _user_info
    FROM users u
    LEFT JOIN auth ON auth.id = u.auth_id
    LEFT JOIN organizations org ON org.id = u.organization_id
    LEFT JOIN public.address a ON a.id = org.address_id
    WHERE u.auth_id = _auth_id
    LIMIT 1;

    RETURN jsonb_build_object(
        'status', 200,
        'message', 'Connexion réuissie',
        'user_info',_user_info
    );
END;
$$;