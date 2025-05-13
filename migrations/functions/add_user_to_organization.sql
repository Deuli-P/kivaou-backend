CREATE OR REPLACE FUNCTION add_user_to_organization(
    _user_email TEXT,
    _organization_id UUID,
    _my_user_id UUID
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE 
    _is_owner BOOLEAN;
    _is_admin BOOLEAN;
    _target_user_id UUID;
    _user JSONB;
BEGIN
    -- Vérifier si l'organisation existe
    IF NOT EXISTS (
        SELECT 1 FROM organizations WHERE id = _organization_id
    ) THEN
        RETURN jsonb_build_object('status', 404, 'message', 'Vous ne pouvez faire cela');
    END IF;

    -- Récupérer l'id de l'utilisateur cible via son email
    SELECT u.id
    INTO _target_user_id
    FROM users u
    JOIN auth a ON u.auth_id = a.id
    WHERE a.email = _user_email;

    IF _target_user_id IS NULL THEN
        RETURN jsonb_build_object('status', 404, 'message', 'Email invalide');
    END IF;

    -- Vérifier si l'utilisateur cible est déjà dans cette organisation
    IF EXISTS (
        SELECT 1 FROM users
        WHERE id = _target_user_id AND organization_id = _organization_id
    ) THEN
        RETURN jsonb_build_object('status', 409, 'message', 'Email invalide');
    END IF;

    -- Vérifier si l'utilisateur cible est dans une autre organisation
    IF EXISTS (
        SELECT 1 FROM users
        WHERE id = _target_user_id AND organization_id IS NOT NULL
    ) THEN
        RETURN jsonb_build_object('status', 409, 'message', 'Email invalide');
    END IF;

    -- Vérifier si l'utilisateur courant est OWNER de l'organisation
    SELECT EXISTS (
        SELECT 1 FROM organizations
        WHERE id = _organization_id AND owner_id = _my_user_id
    ) INTO _is_owner;

    -- Vérifier si l'utilisateur courant est ADMIN de la plateforme
    SELECT EXISTS (
        SELECT 1 FROM users
        LEFT JOIN auth a ON users.auth_id = a.id
        WHERE users.id = _my_user_id and a.user_type = 'admin'
    ) INTO _is_admin;

    IF NOT (_is_owner OR _is_admin) THEN
        RETURN jsonb_build_object('status', 403, 'message', 'Vous ne pouvez faire cela');
    END IF;

    -- Ajouter l'utilisateur à l'organisation
    UPDATE users
    SET organization_id = _organization_id
    WHERE id = _target_user_id;

    -- Renvoyer les infos utiles du user ajouté
    SELECT jsonb_build_object(
        'id', u.id,
        'firstname', u.firstname,
        'lastname', u.lastname,
        'photo_path', u.photo_path
    )
    INTO _user
    FROM users u
    WHERE u.id = _target_user_id;

    RETURN jsonb_build_object(
        'status', 200,
        'message', 'Utilisateur ajouté à l''organisation avec succès',
        'user', _user
    );
END;
$$;