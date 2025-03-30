CREATE OR REPLACE FUNCTION check_middleware_organization(
    _user_id UUID
) 
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE 
    _organization_id UUID;
BEGIN
    -- Récupérer l'organisation de l'utilisateur
    SELECT organization_id INTO _organization_id
    FROM users
    WHERE id = _user_id;

    -- Si pas d'organisation, retour 404
    IF _organization_id IS NULL THEN
        RETURN 404;
    END IF;

    -- Vérifier si l'organisation existe
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
        RETURN 404;
    END IF;

    -- OK
    RETURN 204;
END;
$$;