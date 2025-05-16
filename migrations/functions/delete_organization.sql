CREATE OR REPLACE FUNCTION delete_organization(
    _organization_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _exists INT;
    _event_ids UUID[];
BEGIN
    -- 1. Vérifier si l'utilisateur existe
    SELECT COUNT(*) INTO _exists
    FROM users u
    WHERE u.id = _user_id;

    IF _exists = 0 THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'L''utilisateur n''existe pas'
        );
    END IF;

    -- 2. Vérifier si l'organisation existe
    SELECT COUNT(*) INTO _exists
    FROM organizations o
    WHERE o.id = _organization_id AND o.deleted_at IS NULL;

    IF _exists = 0 THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'L''organisation n''existe pas'
        );
    END IF;

    -- 3. Vérifier si l'utilisateur est admin
    IF NOT EXISTS (
        SELECT 1 
        FROM users u
        LEFT JOIN auth a ON a.id = u.auth_id
        WHERE u.id = _user_id AND a.user_type = 'admin'
    ) THEN
        RETURN jsonb_build_object(
            'status', 403, 
            'message', 'Vous ne pouvez pas faire cette action'
        );
    END IF;

    -- 4. Récupérer tous les event.id liés à l'organisation
    SELECT ARRAY_AGG(id) INTO _event_ids
    FROM events
    WHERE organization_id = _organization_id;

    -- 5. Supprimer les participations liées aux events
    DELETE FROM submits
    WHERE event_id = ANY(_event_ids);

    -- 6. Supprimer les events
    DELETE FROM events
    WHERE id = ANY(_event_ids);

    -- 7. Réinitialiser l'organisation des utilisateurs membres
    UPDATE users
    SET organization_id = NULL
    WHERE organization_id = _organization_id;

    -- 8. Soft delete de l'organisation
    UPDATE organizations
    SET deleted_at = NOW()
    WHERE id = _organization_id;

    RETURN jsonb_build_object(
        'status', 200,
        'message', 'Organisation et événements associés supprimés avec succès'
    );
END;
$$;