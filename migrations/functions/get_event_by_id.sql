CREATE OR REPLACE FUNCTION get_event_by_id(
    _event_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _event JSONB;_organization_id UUID;
BEGIN
    -- 1. Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 404,
            'message', 'Utilisateur introuvable'
        );
    END IF;

    -- 2. Vérifier si l'événement existe et récupérer l'organisation associée
    SELECT organization_id INTO _organization_id
    FROM events
    WHERE id = _event_id AND deleted_at IS NULL;

    IF _organization_id IS NULL THEN
        RETURN jsonb_build_object(
            'status', 404,
            'message', 'Événement introuvable'
        );
    END IF;


    -- 3. Vérifier si l'utilisateur a accès à l'événement
    IF NOT EXISTS (
        SELECT 1 
        FROM users u
        LEFT JOIN auth a ON a.id = u.auth_id
        WHERE u.id = _user_id 
            AND (u.organization_id = _organization_id OR a.user_type = 'admin')
    ) THEN
       RETURN jsonb_build_object(
            'status', 404,
            'message', 'Vous ne pouvez faire cela'
        );
    END IF;

    -- 4. Récupération de l'événements
     SELECT jsonb_build_object(
        'id', evt.id,
        'title', evt.title,
        'start_date', evt.start_date,
        'end_date', evt.end_date,
        'description', COALESCE(evt.description, NULL),
        'created_id', evt.created_by,
        'status', evt.status,
        -- Destination
        'destination', jsonb_build_object(
            'id', d.id,
            'name', d.name,
            'photo_path', d.photo_path,
            'speciality', d.speciality,
            'website', d.website,
            'phone', d.phone,
            'address', jsonb_build_object(
                'id', a.id,
                'number', a.street_number,
                'street', a.street,
                'city', a.city,
                'postale_code', a.postale_code,
                'country', a.country,
                'latitude', a.latitude,
                'longitude', a.longitude
            )
        ),

        -- Inscription
        'submitted', EXISTS (
            SELECT 1 FROM submits s 
            WHERE s.event_id = evt.id 
            AND s.user_id = _user_id 
            AND s.status = 'register'
        ),
        -- Creator
        'owner',jsonb_build_object(
            'id', evt.created_by
        ),

        -- Participants
        'users', (
            SELECT jsonb_agg(jsonb_build_object(
                'id', u.id,
                'firstname', u.firstname,
                'lastname', u.lastname,
                'photo_path', u.photo_path
            ))
            FROM submits s2
            JOIN users u ON s2.user_id = u.id
            WHERE s2.event_id = evt.id and s2.status = 'register'
        )
    ) INTO _event
    FROM events evt
    LEFT JOIN destinations d ON evt.destinations_id = d.id
    LEFT JOIN address a ON d.address_id = a.id
    WHERE evt.organization_id = _organization_id
      AND evt.id = _event_id
      AND d.deleted_at IS NULL
      AND evt.status = 'started';

    RETURN jsonb_build_object(
        'status',200,
        'event',COALESCE(_event, '{}'::jsonb)
    );

END;
$$;