CREATE OR REPLACE FUNCTION create_address(
    _number TEXT,
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

    -- Inserer l'adresse dans la table address
    INSERT INTO address (street, street_number, city, postale_code, country, created_by)
    VALUES (TRIM(_street), _number,TRIM( _city), _postal_code, TRIM(_country), _user_id)
    RETURNING id INTO _address_id;

    RETURN _address_id;
END;
$$;