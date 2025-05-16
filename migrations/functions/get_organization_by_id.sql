CREATE OR REPLACE FUNCTION get_organization_by_id(
    _id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _org_record JSONB;
    _users_list JSONB;
    _events_past JSONB;
    _events_future JSONB;
    _owner_id UUID;
    _destinations_list JSONB;
BEGIN
    -- Vérifier si l'organisation existe
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _id) THEN
        RETURN jsonb_build_object(
            'status', 403,
            'message', 'Vous ne pouvez faire cela'
        );
    END IF;

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 403,
            'message', 'Vous ne pouvez faire cela'
        );
    END IF;

    -- Vérifier si l'utilisateur appartient à l'organisation ou est owner ou admin
    IF NOT EXISTS (
        SELECT 1
        FROM users u
        LEFT JOIN auth a ON a.id = u.auth_id
        WHERE u.id = _user_id
        AND (
            u.organization_id = _id
            OR _user_id = (SELECT owner_id FROM organizations WHERE id = _id)
            OR a.user_type = 'admin'
        )
    ) THEN
        RETURN jsonb_build_object(
            'status', 403,
            'message', 'Vous ne pouvez pas faire cette action'
        );
    END IF;


    -- Récupérer les infos de l'organisation et de son adresse, avec l'owner
    SELECT o.owner_id,
           jsonb_build_object(
               'id', o.id,
               'name', o.name,
               'owner', jsonb_build_object(
                   'id', o.owner_id,
                   'firstname', u.firstname,
                   'lastname', u.lastname,
                   'photo_path', u.photo_path
               ),
               'address', jsonb_build_object(
                   'id', a.id,
                   'street', a.street,
                   'number', a.street_number,
                   'city', a.city,
                   'postale_code', a.postale_code,
                   'country', a.country,
                   'longitude', a.longitude,
                   'latitude', a.latitude
               )
           )
    INTO _owner_id, _org_record
    FROM organizations o
    JOIN address a ON a.id = o.address_id
    LEFT JOIN users u ON u.id = o.owner_id
    WHERE o.id = _id;


    -- Récupérer les autres utilisateurs de l'organisation (hors user et owner)
    SELECT jsonb_agg(jsonb_build_object(
        'id', u.id,
        'firstname', u.firstname,
        'lastname', u.lastname,
        'email', auth.email,
        'photo_path', u.photo_path,
        'role', CASE
            WHEN o.owner_id = u.id THEN 'owner'
            ELSE 'member'
        END
    ))
    INTO _users_list
    FROM users u
    LEFT JOIN auth ON auth.id = u.auth_id
    LEFT JOIN organizations o ON o.id = _id
    WHERE u.organization_id = _id AND u.id != _user_id;

    -- Récupérer les événements passés (jusqu'à hier)
     SELECT jsonb_agg(event_data) INTO _events_past
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
        WHERE evt.organization_id = _id
        AND d.deleted_at IS NULL
        AND evt.status = 'started'
        AND evt.start_date::date < CURRENT_DATE 
        ORDER BY evt.start_date ASC 
    ) AS event_data;

    -- Récupérer les événements futurs (aujourd'hui et plus tard)
    SELECT jsonb_agg(event_data) INTO _events_future
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
        WHERE evt.organization_id = _id
        AND d.deleted_at IS NULL
        AND evt.status = 'started'
        AND evt.start_date::date >= CURRENT_DATE
        ORDER BY evt.start_date ASC 
    ) AS event_data;


    -- Récupérer les destinations de l'organisation
    SELECT jsonb_agg(
        jsonb_build_object(
        'id', d.id,
        'name', d.name,
        'service_type', d.service_type,
        'speciality', d.speciality,
        'schedule', d.schedule,
        'service_link', d.service_link,
        'phone', d.phone,
        'google_page_link', d.google_page_link,
        'website', d.website,
        'photo_path', d.photo_path,
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
    )
    INTO _destinations_list
    FROM destinations d
    LEFT JOIN address a ON a.id = d.address_id
    WHERE d.organization_id = _id;

    -- Retourner le JSON global
    RETURN jsonb_build_object(
        'status', 200,
        'message', 'Organization trouvée',
        'organization', _org_record,
        'users', COALESCE(_users_list, '[]'::jsonb),
        'events', jsonb_build_object(
            'past', COALESCE(_events_past, '[]'::jsonb),
            'future', COALESCE(_events_future, '[]'::jsonb)
        ),
        'destinations', COALESCE(_destinations_list, '[]'::jsonb)
    );
END;
$$;