CREATE OR REPLACE FUNCTION create_user(
    _email TEXT,
    _password TEXT,
    _firstname TEXT,
    _lastname TEXT,
    _photo_path TEXT DEFAULT NULL
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE 
    _auth_id UUID;
    _user_id UUID;
BEGIN

    -- Check si l'email n'est pas déjà utilisé
    IF EXISTS (SELECT 1 FROM auth WHERE email = _email) THEN
        RETURN jsonb_build_object(
            'status', 404,
            'message', 'Erreur serveur lors de la création de l''utilisateur'
        );
    END IF;

    -- Insérer dans la table auth et récupérer l'ID généré
    INSERT INTO auth (email, password, user_type)
    VALUES (_email, _password, 'user')
    RETURNING id INTO _auth_id;

    -- Insérer dans la table users avec l'ID récupéré
    INSERT INTO users (auth_id, firstname, lastname, photo_path)
    VALUES (_auth_id, _firstname, _lastname, _photo_path)
    RETURNING id INTO _user_id;

    RETURN jsonb_build_object(
        'status', 200,
        'message', 'Utilisateur créé avec succès',
        'user', jsonb_build_object(
            'id', _user_id,
            'email', _email,
            'user_type', 'user',
            'firstname', _firstname,
            'lastname', _lastname,
            'photo_path', _photo_path
        )   
    );
END;
$$;