CREATE OR REPLACE FUNCTION get_destinations(
    _organization_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _places JSONB;
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

    -- Récupérer les lieux de l'organisation
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', d.id,
            'name', d.name,
            'photo_path', d.photo_path,
            'speciality', d.speciality,
            'address', jsonb_build_object(
                'street', a.street,
                'street_number', a.street_number,
                'city', a.city,
                'postale_code', a.postale_code,
                'country', a.country
            )
        )
    )
    INTO _places
    FROM destinations d
    JOIN public.address a ON d.address_id = a.id
    WHERE d.organization_id = _organization_id
      AND d.deleted_at IS NULL;

    
    RETURN COALESCE(_places, '[]'::jsonb);
END;
$$;