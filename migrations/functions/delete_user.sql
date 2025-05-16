CREATE OR REPLACE FUNCTION delete_user(
    _user_id UUID,
    _admin_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _event_user_ids UUID[];
    _event_organization_ids UUID[];
    _auth_id UUID;
    _organization_id UUID;
    _new_owner_id UUID;
BEGIN
    -- 1. Vérifier si l'utilisateur à supprimer existe
    IF NOT EXISTS (
        SELECT 1 FROM users WHERE id = _user_id AND deleted_at IS NULL
    ) THEN
        RETURN jsonb_build_object(
            'status', 404,
            'message', 'L''utilisateur à supprimer n''existe pas'
        );
    END IF;

    -- 2. Vérifier que l'admin est bien admin
    IF NOT EXISTS (
        SELECT 1
        FROM users u
        LEFT JOIN auth a ON a.id = u.auth_id
        WHERE u.id = _admin_id AND a.user_type = 'admin'
    ) THEN
        RETURN jsonb_build_object(
            'status', 403,
            'message', 'Vous n''avez pas les droits pour effectuer cette action'
        );
    END IF;

    -- 3.Remplacer le propriétaire de l'organisation si l'utilisateur l'est
    SELECT id INTO _organization_id
    FROM organizations o 
    WHERE o.owner_id = _user_id AND o.deleted_at IS NULL; 

    IF _organization_id IS NOT NULL THEN
        -- Selectionner un nouveau propriétaire aléatoire
        SELECT id INTO _new_owner_id
        FROM users
        WHERE organization_id = _organization_id
          AND id <> _user_id
          AND deleted_at IS NULL
        ORDER BY RANDOM()
        LIMIT 1;

        IF _new_owner_id IS NULL THEN
        -- Si aucun membre n'est trouvé, on supprime l'organisation
            -- Select les events liés à l'organisation
            SELECT ARRAY_AGG(id)
            INTO _event_organization_ids
            FROM events e
            WHERE e.organization_id = _organization_id;

            IF _event_organization_ids IS NOT NULL AND cardinality(_event_organization_ids) > 0 THEN
                -- Supprimer les participations liées aux events, les events et l'organisation

                DELETE FROM submits
                WHERE event_id = ANY(_event_organization_ids);

                DELETE FROM events
                WHERE id = ANY(_event_organization_ids);

                DELETE FROM organizations
                WHERE id = _organization_id;

            END IF;
        ELSE
        
            UPDATE organizations o
            SET o.owner_id = _new_owner_id
            WHERE o.id = _organization_id;
        
        END IF;

    END IF;


    -- 4. Récupérer tous les events créés par le user
    SELECT ARRAY_AGG(id)
    INTO _event_user_ids
    FROM events
    WHERE created_by = _user_id;

    -- 5. Si l'utilisateur a créé des events alors on les supprimesavec les participations
    IF _event_user_ids IS NOT NULL AND cardinality(_event_user_ids) > 0 THEN

        DELETE FROM submits
        WHERE user_id = _user_id
        OR event_id = ANY(_event_user_ids);

        DELETE FROM events
        WHERE id = ANY(_event_user_ids);
    END IF;

    -- 6. Supprimer son auth
    SELECT auth_id INTO _auth_id FROM users WHERE id = _user_id;
    DELETE FROM auth WHERE id = _auth_id;

    -- 7. Soft delete de l'utilisateur
    UPDATE users
    SET deleted_at = NOW(),
        deleted_by = _admin_id
    WHERE id = _user_id;

    RETURN jsonb_build_object(
        'status', 200,
        'message', 'Utilisateur supprimé et responsabilités transférées'
    );
END;
$$;