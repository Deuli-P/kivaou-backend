CREATE OR REPLACE FUNCTION create_address(
    _number INTEGER,
    _street TEXT,
    _postal_code INTEGER,
    _city TEXT,
    _country TEXT,
    _user_id UUID
) 
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE 
    _address_id UUID;
BEGIN


    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exists', _user_id;
    END IF;

    -- Inserer l'adresse dans la table address
    INSERT INTO address (street, street_number, city, postale_code, country, created_by)
    VALUES (_street, _number, _city, _postal_code, _country, _user_id)
    RETURNING id INTO _address_id;

    RETURN _address_id;
END;
$$;