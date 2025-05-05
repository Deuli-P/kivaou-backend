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
    -- Vérifier si l'organisation existe
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
        RAISE EXCEPTION 'Organization with ID % does not exist', _organization_id;
    END IF;

    -- vérifier si le user existe 
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', _user_id;
    END IF;

    -- Vérifier si le user appartient à l'organisation
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id AND organization_id = _organization_id) THEN
        RAISE EXCEPTION 'User with ID % does not belong to organization %', _user_id, _organization_id;
    END IF;

    -- Récupérer les events de l'organisation qui sont active ()
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', evt.id,
            'title', evt.title,
            'start_date', evt.start_date,
            'end_date', evt.end_date,
            'description', COALESCE(evt.description, null),
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
            )
        )
    )
    INTO _events
    FROM public.events evt
    LEFT JOIN public.destinations d ON evt.destinations_id = d.id
    LEFT JOIN public.address a ON d.address_id = a.id
    WHERE evt.organization_id = _organization_id
    AND d.deleted_at IS NULL
    AND evt.status = 'started'
    AND evt.start_date > NOW();

    
    RETURN COALESCE(_events, '[]'::jsonb);
END;
$$;