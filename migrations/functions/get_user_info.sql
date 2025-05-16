CREATE OR REPLACE FUNCTION get_user_info(
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _organization_id UUID;
    _user_info JSONB;
    _events_submit JSONB;
    _org_role TEXT;
BEGIN
    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', _user_id;
    END IF;

    -- Récupérer organization_id
    SELECT organization_id INTO _organization_id
    FROM users
    WHERE id = _user_id;

    -- Si pas d'organisation, retourner les infos simples
    IF _organization_id IS NULL THEN
        SELECT jsonb_build_object(
            'id', u.id,
            'firstname', u.firstname,
            'lastname', u.lastname,
            'email', a.email,
            'photo_path', u.photo_path,
            'organization', jsonb_build_object(
                'id', NULL,
                'name', NULL,
                'role', NULL
            )
        )
        INTO _user_info
        FROM users u
        LEFT JOIN auth a ON a.id = u.auth_id
        WHERE u.id = _user_id;

        RETURN jsonb_build_object(
            'user_info', _user_info,
            'events_submit', '[]'::jsonb
        );
    END IF;

    -- Déterminer le rôle
    SELECT CASE
        WHEN o.owner_id = _user_id THEN 'OWNER'
        ELSE 'MEMBER'
    END INTO _org_role
    FROM organizations o
    WHERE o.id = _organization_id;

    -- Infos utilisateur avec organisation
    SELECT jsonb_build_object(
        'id', u.id,
        'firstname', u.firstname,
        'lastname', u.lastname,
        'email', a.email,
        'photo_path', u.photo_path,
        'organization', jsonb_build_object(
            'id', o.id,
            'name', o.name,
            'role', _org_role
        )
    )
    INTO _user_info
    FROM users u
    LEFT JOIN auth a ON a.id = u.auth_id
    LEFT JOIN organizations o ON o.id = u.organization_id
    WHERE u.id = _user_id;

   
    -- Événements où il est inscrit 
    SELECT jsonb_agg(event_data) INTO _events_submit
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

             -- Inscription
            true AS submitted,

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

           

            -- Participants
            (
                SELECT jsonb_agg(jsonb_build_object(
                    'id', u.id,
                    'firstname', u.firstname,
                    'lastname', u.lastname,
                    'photo_path', u.photo_path
                ))
                FROM submits s2
                JOIN users u ON s2.user_id = u.id
                WHERE s2.event_id = evt.id AND s2.status = 'register'
            ) AS users

        FROM events evt
        JOIN submits s ON s.event_id = evt.id
        LEFT JOIN destinations d ON evt.destinations_id = d.id
        LEFT JOIN address a ON d.address_id = a.id
        WHERE evt.organization_id = _organization_id
        AND s.user_id = _user_id
        AND evt.status = 'started'
        AND s.status = 'register'
    ) AS event_data;

    -- Retour
    RETURN jsonb_build_object(
        'user_info', _user_info,
        'events_submit', COALESCE(_events_submit, '[]'::jsonb)
    );
END;
$$;