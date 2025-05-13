CREATE OR REPLACE FUNCTION update_user_info(
    _user_id UUID,
    _firstname TEXT,
    _lastname TEXT,
    _photo_path TEXT
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', _user_id;
    END IF;


    UPDATE users
    SET firstname = TRIM(_firstname),
        lastname = TRIM(_lastname),
        photo_path = TRIM(_photo_path)
    WHERE id = _user_id;

   -- Retourne les nouvelles infos du user
    RETURN jsonb_build_object(
        'firstname', _firstname,
        'lastname', _lastname,
        'photo_path', _photo_path
    );
END;
$$;