CREATE OR REPLACE FUNCTION create_organization(
    _name TEXT,
    _number INTEGER,
    _street TEXT,
    _postal_code INTEGER,
    _city TEXT,
    _country TEXT,
    _owner_id UUID
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE 
    _organization_id UUID;
    _address_id UUID;
    _org_record JSONB;
BEGIN
    -- Vérifier si l'organisation existe déjà
    IF EXISTS (SELECT 1 FROM organizations WHERE name = _name) THEN
        RETURN jsonb_build_object(
            'status',400,
            'message','Ce nom est déjà utilisé'
        );
    END IF;

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _owner_id) THEN
        RETURN jsonb_build_object(
            'status', 400,
            'message','Vous ne pouvez faire cela'
            );
    END IF;

  -- Vérifier si l'utilisateur est déjà OWNER ou MEMBRE d'une organisation
    IF EXISTS (
        SELECT 1
        FROM organizations o
        WHERE o.owner_id = _owner_id
    )
    OR EXISTS (
        SELECT 1
        FROM users u
        WHERE u.id = _owner_id AND u.organization_id IS NOT NULL
    ) THEN
    RETURN jsonb_build_object(
        'status', 400,
        'message','Vous êtes déjà dans une organisation, veuillez la quitter avant d''en créer une nouvelle'
    );
    END IF;
    -- Inserer l'adresse dans la table address
    SELECT create_address(_number, _street, _postal_code, _city, _country, _owner_id)
    INTO _address_id;

    IF _address_id IS NULL THEN
        RETURN jsonb_build_object(
            'status', 400,
            'message','Erreur de creation de l''adresse'
        );
    END IF;

    -- Insérer dans la table organizations 
    INSERT INTO organizations (owner_id, address_id, name, created_by)
    VALUES (_owner_id, _address_id, _name, _owner_id)
    RETURNING id INTO _organization_id;

    IF _organization_id IS NULL THEN
        RETURN jsonb_build_object(
            'status', 400,
            'message','Erreur de creation de l''organisation'
        );
    END IF;

    UPDATE users
    SET organization_id = _organization_id
    WHERE id = _owner_id;

    -- Récupérer toutes les infos orga + adresse
    SELECT jsonb_build_object(
            'id', o.id,
            'name', o.name,
            'owner', jsonb_build_object(
                'id', o.owner_id
            ),
            'role', 'OWNER',
            'address', jsonb_build_object(
                'id', a.id,
                'street', a.street,
                'street_number', a.street_number,
                'city', a.city,
                'postale_code', a.postale_code,
                'country', a.country,
                'longitude', a.longitude,
                'latitude', a.latitude
            )
    )
    INTO _org_record
    FROM organizations o
    JOIN address a ON a.id = o.address_id
    WHERE o.id = _organization_id;

    RETURN jsonb_build_object(
        'status', 200,
        'message', 'Organisation créée avec succès',
        'organization', _org_record  
    );


END;
$$;