CREATE OR REPLACE FUNCTION get_auth_by_email(
    _email TEXT
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _auth_info JSONB;
BEGIN

    SELECT json_build_object(
        'id' , auth.id,
        'email' , auth.email,
        'password_save' , auth.password
    ) INTO _auth_info
    FROM auth 
    WHERE email = _email 
    LIMIT 1;

    RETURN _auth_info;
END;
$$;