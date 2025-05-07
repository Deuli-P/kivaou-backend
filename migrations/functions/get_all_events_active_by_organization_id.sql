CREATE OR REPLACE FUNCTION get_all_events_active_by_organization_id(
    _organization_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _events JSONB;
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

    -- Récupération des événements triés
    SELECT jsonb_agg(event_data) INTO _events
    FROM (
        SELECT 
            evt.id,
            evt.title,
            evt.start_date,
            evt.end_date,
            COALESCE(evt.description, NULL) AS description,
            -- Creator
            jsonb_build_object(
                'id', evt.created_by
            ) AS owner,

            -- Destination
            jsonb_build_object(
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
            ) AS destination,

            -- Si inscrit
            EXISTS (
                SELECT 1 FROM submits s 
                WHERE s.event_id = evt.id 
                AND s.user_id = _user_id 
                AND s.status = 'register'
            ) AS submitted,

            -- Participants
            (
                SELECT jsonb_agg(jsonb_build_object(
                    'id', u.id,
                    'firtname', u.firstname,
                    'lastname',u.lastname,
                    'photo_path', u.photo_path
                ))
                FROM submits s2
                JOIN users u ON s2.user_id = u.id
                WHERE s2.event_id = evt.id AND s2.status = 'register'
            ) AS users

        FROM public.events evt
        LEFT JOIN public.destinations d ON evt.destinations_id = d.id
        LEFT JOIN public.address a ON d.address_id = a.id
        WHERE evt.organization_id = _organization_id
        AND d.deleted_at IS NULL
        AND evt.status = 'started'
        AND evt.start_date::date >= CURRENT_DATE
        ORDER BY evt.start_date ASC
    ) AS event_data;

    RETURN COALESCE(_events, '[]'::jsonb);
END;
$$;