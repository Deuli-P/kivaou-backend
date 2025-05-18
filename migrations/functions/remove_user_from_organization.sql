CREATE OR REPLACE FUNCTION remove_user_from_organization(
    _target_user_id UUID,
    _my_user_id UUID
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE 
    _organization_id UUID;
    _is_owner BOOLEAN;
    _is_admin BOOLEAN;
BEGIN
    -- 1. Vérifier si l'utilisateur cible existe
    IF NOT EXISTS (
        SELECT 1 FROM users WHERE id = _target_user_id
    ) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'Utilisateur introuvable'
        );
    END IF;

    -- 2. Vérifier s'il est dans une organisation et récupérer son organization_id
    SELECT organization_id INTO _organization_id
    FROM users
    WHERE id = _target_user_id;

    IF _organization_id IS NULL THEN
        RETURN jsonb_build_object(
            'status', 409, 
            'message', 'L''utilisateur n''est dans aucune organisation'
        );
    END IF;

    -- 3. Vérifier s'il est propriétaire de l'organisation
    IF EXISTS (
        SELECT 1 FROM organizations o
        WHERE o.id = _organization_id AND o.owner_id = _target_user_id
    ) THEN
        RETURN jsonb_build_object(
            'status', 409, 
            'message', 'Impossible de retirer un propriétaire d''organisation'
        );
    END IF;

    -- 4. Vérifier si l'utilisateur courant est owner de cette organisation
    SELECT EXISTS (
        SELECT 1 FROM organizations o
        WHERE o.id = _organization_id AND o.owner_id = _my_user_id
    ) INTO _is_owner;

    -- 5. Vérifier si l'utilisateur courant est admin de la plateforme
    SELECT EXISTS (
        SELECT 1 FROM auth
        WHERE id = (SELECT auth_id FROM users WHERE id = _my_user_id)
        AND user_type = 'admin'
    ) INTO _is_admin;

    -- 6. Si aucun droit => refuser
    IF NOT (_is_owner OR _is_admin) THEN
        RETURN jsonb_build_object(
            'status', 403, 
            'message', 'Vous n''avez pas l''autorisation pour effectuer cette action'
        );
    END IF;

    -- 7. Supprimer les participations du user dans cette organisation
    DELETE FROM submits
    WHERE user_id = _target_user_id
    AND event_id IN (
        SELECT id FROM events
        WHERE organization_id = _organization_id
    );

    -- 8. Supprimer ses propres événements dans cette organisation
    DELETE FROM events
    WHERE created_by = _target_user_id
    AND organization_id = _organization_id;

    -- 9. Supprimer l'affiliation à l'organisation
    UPDATE users
    SET organization_id = NULL
    WHERE id = _target_user_id;

    -- 10. Retour succès
    RETURN jsonb_build_object(
        'status', 200, 
        'message', 'Utilisateur retiré de l''organisation avec succès'
    );
END;
$$;