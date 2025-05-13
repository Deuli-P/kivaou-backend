CREATE OR REPLACE FUNCTION check_middleware_organization(
    _user_id UUID,
    _organization_id UUID
) 
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
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

    -- Vérifier si l'utilisateur appartient à l'organisation ou est owner
    IF NOT EXISTS (
        SELECT 1 FROM users
        WHERE id = _user_id
        AND (
            organization_id = _organization_id
            OR _user_id = (SELECT owner_id FROM organizations WHERE id = _organization_id)
        )
    ) THEN
        RETURN 403;
    END IF;

    -- OK
    RETURN 200;
END;
$$;