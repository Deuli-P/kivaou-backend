CREATE OR REPLACE FUNCTION check_middleware_owner(
    _user_id UUID,
    _organization_id UUID
) 
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RETURN 404;
    END IF;

    -- Vérifier si l'organisation existe
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
        RETURN 404;
    END IF;

    -- Vérifier si l'utilisateur est le propriétaire de l'organisation
    IF NOT EXISTS (
        SELECT 1 FROM organizations
        WHERE id = _organization_id
        AND owner_id = _user_id
    ) THEN
        RETURN 402;
    END IF;

    -- OK
    RETURN 200;
END;
$$;