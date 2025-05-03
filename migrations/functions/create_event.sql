CREATE OR REPLACE FUNCTION create_event(
    _title TEXT,
    _start_date TIMESTAMP,
    _end_date TIMESTAMP,
    _destinations_id UUID,
    _organization_id UUID,
    _user_id UUID,
    _description TEXT DEFAULT NULL
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

    -- Vérifier si le user est bien dans l'organisation
    IF NOT EXISTS (
        SELECT 1 FROM organizations
        WHERE id = _organization_id AND owner_id = _user_id
    ) THEN
        RETURN jsonb_build_object('status', 403, 'message', 'User is not the owner of the organization');
    END IF;

    -- Vérifier si la destination existe
    IF NOT EXISTS (
        SELECT 1 FROM destinations d
        WHERE d.id = _destinations_id AND d.organization_id= _organization_id
    ) THEN
        RETURN jsonb_build_object('status', 404, 'message', 'Address does not exist');
    END IF;


    -- Insérer l'event
    INSERT INTO events (
        title,
        description,
        start_date,
        end_date,
        organization_id,
        destinations_id,
        status,
        created_by
    ) VALUES (
        _title,
        _description,
        _start_date,
        _end_date,
        _organization_id,
        _destinations_id,
        'started'::event_status,
        _user_id
    );

    -- Succès
    RETURN jsonb_build_object('status', 204, 'message', 'Event created successfully');

END;
$$;