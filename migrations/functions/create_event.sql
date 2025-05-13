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
    _event_id UUID;
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
        SELECT 1 FROM organizations o
        LEFT JOIN users u ON u.id = _user_id
        WHERE o.id = _organization_id AND u.organization_id = o.id
    ) THEN
        RETURN jsonb_build_object('status', 403, 'message', 'Vous ne pouvez pas faire cela car vous êtes externe à l''organisation');
    END IF;

    -- Vérifier si la destination existe
    IF NOT EXISTS (
        SELECT 1 FROM destinations d
        WHERE d.id = _destinations_id AND d.organization_id= _organization_id
    ) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'L''adresse du lieu n''existe pas ou n''appartient pas à l''organisation'
        );
    END IF;

    -- Vérrifier si la date de début est supérieure à la date de fin
    IF _start_date > _end_date THEN
        RETURN jsonb_build_object(
            'status', 400, 
            'message', 'La date de début doit être inférieure à la date de fin'
        );
    END IF;

    -- Vérifier si la date de début est supérieure à la date actuelle
    IF _start_date < NOW() THEN
        RETURN jsonb_build_object(
            'status', 400, 
            'message', 'La date de début doit être plus tard à la date actuelle'
        );
    END IF;

    -- Vérifier si l'utilisateur a déjà créé un événement la même date
    IF EXISTS (
        SELECT 1 FROM events
        WHERE start_date = _start_date
        AND organization_id = _organization_id
        AND created_by = _user_id
    ) THEN
        RETURN jsonb_build_object('status', 409, 'message', 'Vous avez déjà créé un événement à cette date');
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
        TRIM(_title),
        TRIM(_description),
        _start_date,
        _end_date,
        _organization_id,
        _destinations_id,
        'started'::event_status,
        _user_id
    ) RETURNING id INTO _event_id;

    IF _event_id IS NULL THEN
        RETURN jsonb_build_object('status', 500, 'message', 'Erreur lors de la création de l''événement');
    END IF;
    
    -- Insérer la participation du createur de l'événement
    INSERT INTO submits (event_id, user_id, status)
    VALUES (_event_id, _user_id, 'register')
    ON CONFLICT (event_id, user_id) DO NOTHING;

    -- Succès
    RETURN jsonb_build_object(
        'status', 200, 
        'message', 'Evenement créé avec succès',
        'event_id', _event_id);
END;
$$;