CREATE OR REPLACE FUNCTION create_destination(
    _name TEXT,
    _organization_id UUID,
    _street_number INTEGER,
    _street TEXT,
    _postale_code INTEGER,
    _city TEXT,
    _country TEXT,
    _longitude FLOAT,
    _latitude FLOAT,
    _user_id UUID,
    _service_type TEXT DEFAULT NULL,
    _service_link TEXT DEFAULT NULL,
    _schedule JSONB DEFAULT NULL,
    _photo_path TEXT DEFAULT NULL,
    _google_page_link TEXT DEFAULT NULL,
    _speciality TEXT DEFAULT NULL,
    _phone TEXT DEFAULT NULL,
    _website TEXT DEFAULT NULL
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE 
    _address_id UUID;
BEGIN
    -- Vérifier si l'organisation existe déjà
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'Organization does not exists'
        );
    END IF;

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'User does not exist'
        );
    END IF;

    -- Vérifier si le user est bien owner de l'organisation
    IF NOT EXISTS (
        SELECT 1 FROM organizations
        WHERE id = _organization_id AND owner_id = _user_id
    ) THEN
        RETURN jsonb_build_object('status', 403, 'message', 'User is not the owner of the organization');
    END IF;

    -- Insérer l'adresse
    SELECT public.create_address(
        _street_number,
        _street,
        _postale_code,
        _city,
        _country,
        _user_id
    ) INTO _address_id;

    -- Insérer la destination
    INSERT INTO destinations (
        name,
        organization_id,
        address_id,
        service_type,
        service_link,
        schedule,
        photo_path,
        google_page_link,
        speciality,
        phone,
        website,
        created_by
    ) VALUES (
        _name,
        _organization_id,
        _address_id,
        _service_type::service_type,
        _service_link,
        _schedule,
        _photo_path,
        _google_page_link,
        _speciality,
        _phone,
        _website,
        _user_id
    );

    -- Succès
    RETURN jsonb_build_object('status', 204, 'message', 'Destination created successfully');

END;
$$;