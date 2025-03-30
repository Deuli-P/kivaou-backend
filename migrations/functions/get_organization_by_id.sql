CREATE OR REPLACE FUNCTION get_organization_by_id(
    _id UUID
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$

BEGIN
    -- Vérifier si l'organisation existe déjà
    IF EXISTS (SELECT 1 FROM organizations WHERE name = _name) THEN
        RAISE EXCEPTION 'Organization with name % already exists', _name;
    END IF;

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _owner_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', _owner_id;
    END IF;

    -- Inserer l'adresse dans la table address
    INSERT INTO address (street, street_number, city, postale_code, country, created_by)
    VALUES (_street, _number, _city, _postal_code, _country, _owner_id)
    RETURNING id INTO _address_id;

    -- Insérer dans la table organizations 
    INSERT INTO organizations (owner_id, address_id, name, created_by)
    VALUES (_owner_id, _address_id, _name, _owner_id)
    RETURNING id INTO _organization_id;

    IF _organization_id IS NULL THEN
        RAISE EXCEPTION 'Failed to create organization';
    END IF;

    UPDATE users
    SET organization_id = _organization_id
    WHERE id = _owner_id;

    -- Récupérer toutes les infos orga + adresse
    SELECT 
        o.id,
        o.name,
        o.owner_id,
        jsonb_build_object(
            'id', a.id,
            'street', a.street,
            'street_number', a.street_number,
            'city', a.city,
            'postale_code', a.postale_code,
            'country', a.country,
            'longitude', a.longitude,
            'latitude', a.latitude
        ) AS address
    INTO _org_record
    FROM organizations o
    JOIN public.address a ON a.id = o.address_id
    WHERE o.id = _organization_id;

    -- Retourner l'objet JSON complet
    RETURN to_jsonb(_org_record);

END;
$$;