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
        RAISE EXCEPTION 'Organization with ID % does not exist', _id;
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
                   'street_number', a.street_number,
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
        'photo_path', u.photo_path
    ))
    INTO _users_list
    FROM users u
    LEFT JOIN auth ON auth.id = u.auth_id
    WHERE u.organization_id = _id AND u.id != _owner_id AND u.id != _user_id;

    -- Récupérer les événements passés (jusqu'à hier)
    SELECT jsonb_agg(jsonb_build_object(
        'id', e.id,
        'name', e.title,
        'start_date', e.start_date,
        'end_date', e.end_date,
        'description', e.description
    ))
    INTO _events_past
    FROM events e
    WHERE e.organization_id = _id AND e.start_date < NOW() + INTERVAL '1 day'
        AND status NOT IN ('deleted', 'cancelled');

    -- Récupérer les événements futurs (aujourd'hui et plus tard)
    SELECT jsonb_agg(jsonb_build_object(
        'id', e.id,
        'name', e.title,
        'start_date', e.start_date,
        'end_date', e.end_date,
        'description', e.description
    ))
    INTO _events_future
    FROM events e
    WHERE e.organization_id = _id AND e.start_date >= NOW() + INTERVAL '1 day'
        AND status NOT IN ('deleted', 'cancelled');

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
        'organization_info', _org_record,
        'users', COALESCE(_users_list, '[]'::jsonb),
        'events_past', COALESCE(_events_past, '[]'::jsonb),
        'events_future', COALESCE(_events_future, '[]'::jsonb),
        'destinations', COALESCE(_destinations_list, '[]'::jsonb)
    );
END;
$$;