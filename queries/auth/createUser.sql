CREATE OR REPLACE FUNCTION create_user(
    _email TEXT,
    _firstname TEXT,
    _lastname TEXT,
    _password TEXT,
    _photo_path TEXT
) 
LANGUAGE plpgsql
AS $$
SECURITY DEFINER
RETURNS JSONB
DECLARE 
    _id UUID;
BEGIN

    -- Insérer dans la table auth et récupérer l'ID généré
    INSERT INTO auth (email, password)
    VALUES (_email, _password)
    RETURNING id INTO _id;

    INSERT INTO users (auth_id, email, firstname, lastname, photo_path)
    VALUES (_id, _email, _firstname, _lastname, _photo_path)
    RETURNING jsonb_build_object(
        'id', id,
        'email', email,
        'firstname', firstname,
        'lastname', lastname,
        'photo_path', photo_path
    ) INTO user_data;

    RETURN user_data;

    
    RETURN NEXT;
END;
$$;