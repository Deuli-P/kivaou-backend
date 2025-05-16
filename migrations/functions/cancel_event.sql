CREATE OR REPLACE FUNCTION cancel_event(
    _event_id UUID,
    _organization_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _creator_id UUID;
BEGIN
    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'Vous ne pouvez faire cette action'
        );
    END IF;

    -- Vérifier si l'organisation existe
    IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = _organization_id) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'Vous ne pouvez faire cette action'
        );
    END IF;

    -- Vérifier si l'utilisateur est le owner de l'organisation
    IF NOT EXISTS (
        SELECT 1 FROM organizations
        WHERE id = _organization_id AND owner_id = _user_id
    ) THEN
        RETURN jsonb_build_object(
            'status', 403, 
            'message', 'Vous ne pouvez faire cette action'
        );
    END IF;
    -- Supprimer toutes les participations liées
    DELETE FROM submits s
    WHERE s.event_id = _event_id;

    -- Marquer l'événement comme annulé
    UPDATE events
    SET 
        status = 'cancelled'::event_status,
        deleted_at = CURRENT_TIMESTAMP,
        deleted_by = _user_id
    WHERE id = _event_id AND created_by = _user_id;

    RETURN jsonb_build_object(
        'status', 200, 
        'message', 'Event cancelled successfully'
    );
END;
$$;