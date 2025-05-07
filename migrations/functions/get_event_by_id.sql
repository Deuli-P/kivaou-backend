CREATE OR REPLACE FUNCTION get_event_by_id(
    _organization_id UUID,
    _event_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _event JSONB;
BEGIN
    -- Vérifications
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
        RAISE EXCEPTION 'Organization with ID % does not exist', _organization_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', _user_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM users 
        WHERE id = _user_id AND organization_id = _organization_id
    ) THEN
        RAISE EXCEPTION 'User with ID % does not belong to organization %', _user_id, _organization_id;
    END IF;

    -- Récupération de l'événements
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
            WHERE s2.event_id = evt.id
        )
    ) INTO _event
    FROM events evt
    LEFT JOIN destinations d ON evt.destinations_id = d.id
    LEFT JOIN address a ON d.address_id = a.id
    WHERE evt.organization_id = _organization_id
      AND evt.id = _event_id
      AND d.deleted_at IS NULL
      AND evt.status = 'started';

    RETURN COALESCE(_event, '{}'::jsonb);

END;
$$;