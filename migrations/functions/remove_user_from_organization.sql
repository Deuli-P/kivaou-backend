CREATE OR REPLACE FUNCTION remove_user_from_organization(
    _target_user_id UUID,
    _organization_id UUID,
    _my_user_id UUID
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE 
    _is_owner BOOLEAN;
    _is_admin BOOLEAN;
BEGIN
    -- Vérifier si l'organisation existe
    IF NOT EXISTS (
        SELECT 1 FROM organizations WHERE id = _organization_id
    ) THEN
        RETURN jsonb_build_object('status', 404, 'message', 'Vous ne pouvez faire cela');
    END IF;

    -- Vérifier si l'utilisateur cible existe
    IF NOT EXISTS (
        SELECT 1 FROM users WHERE id = _target_user_id
    ) THEN
        RETURN jsonb_build_object('status', 404, 'message', 'Utilisateur introuvable');
    END IF;

    -- Vérifier si l'utilisateur cible est déjà dans cette organisation
    IF NOT EXISTS (
        SELECT 1 FROM users
        WHERE id = _target_user_id AND organization_id = _organization_id
    ) THEN
        RETURN jsonb_build_object('status', 409, 'message', 'Vous ne pouvez faire cela');
    END IF;

    -- Vérifier si l'utilisateur cible est dans une autre organisation
    IF EXISTS (
        SELECT 1 FROM users
        WHERE id = _target_user_id AND organization_id IS NOT NULL
    ) THEN
        RETURN jsonb_build_object('status', 409, 'message', 'Vous ne pouvez pas faire cela');
    END IF;

    -- Vérifier si l'utilisateur courant est OWNER de l'organisation
    SELECT EXISTS (
        SELECT 1 FROM organizations
        WHERE id = _organization_id AND owner_id = _my_user_id
    ) INTO _is_owner;

    -- Vérifier si l'utilisateur courant est ADMIN de la plateforme
    SELECT EXISTS (
        SELECT 1 FROM auth
        WHERE user_id = _my_user_id AND user_type = 'ADMIN'
    ) INTO _is_admin;

    IF NOT (_is_owner OR _is_admin) THEN
        RETURN jsonb_build_object('status', 403, 'message', 'Vous ne pouvez pas faire cela');
    END IF;

    -- Ajouter l'utilisateur à l'organisation
    UPDATE users
    SET organization_id = NULL
    WHERE id = _target_user_id;


    RETURN jsonb_build_object(
        'status', 200, 
        'message', 'Utilisateur retiré de l''organisation avec succès'
    );
END;
$$;