CREATE OR REPLACE FUNCTION delete_event(
    _event_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _creator_id UUID;
    _organization_id UUID;
BEGIN
    --1. Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users u WHERE u.id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'L''utilisateur n''existe pas'
        );
    END IF;

     -- 2. Vérifier si l'événement existe et récupérer l'organisation associée
    SELECT organization_id INTO _organization_id
    FROM events e
    WHERE e.id = _event_id AND deleted_at IS NULL;

    IF _organization_id IS NULL THEN
        RETURN jsonb_build_object(
            'status', 404,
            'message', 'Événement introuvable'
        );
    END IF;

    -- 3. Vérifier si le user est admin
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

    -- 4. Supprimer toutes les participations liées
    DELETE FROM submits s
    WHERE s.event_id = _event_id;

    -- 5. Supprimer l'evennt
    DELETE FROM events e
    WHERE e.id = _event_id;

    RETURN jsonb_build_object(
        'status', 200, 
        'message', 'Evénement supprimé avec succès'
    );
END;
$$;