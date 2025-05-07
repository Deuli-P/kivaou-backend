CREATE OR REPLACE FUNCTION cancel_submit_event(
    _event_id UUID,
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    _organization_id UUID;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist', _user_id;
    END IF;

    -- Check if organization exists
    SELECT organization_id INTO _organization_id
    FROM users
    WHERE id = _user_id;

    -- Check if event exists and user is authorized to cancel it
    IF NOT EXISTS (SELECT 1 FROM events WHERE id = _event_id AND organization_id = _organization_id) THEN
        RAISE EXCEPTION 'Event with ID % does not exist or user is not authorized to submit it', _event_id;
    END IF;

    -- The user have 5 scenarios with the event

    -- 1. The user is le creator of the event
    IF EXISTS (SELECT 1 FROM events WHERE id = _event_id AND created_by = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 'error',
            'message', 'Vous ne pouvez pas quitter votre propre événement'
        );
    END IF;

    
      -- 2. The user is 'register' to the event
    IF EXISTS (SELECT 1 FROM submits WHERE event_id = _event_id AND user_id = _user_id AND status = 'register') THEN
        UPDATE submits
        SET status = 'cancelled'
        WHERE event_id = _event_id AND user_id = _user_id AND status = 'register';

        RETURN jsonb_build_object(
            'status', 'success',
            'message', 'Event submit cancelled successfully'
        );
    END IF;


      -- 3. The user is 'cancelled' to the event
    IF EXISTS (SELECT 1 FROM submits WHERE event_id = _event_id AND user_id = _user_id AND status = 'cancelled') THEN
        RETURN jsonb_build_object(
            'status', 'error',
            'message', 'You are already cancelled to this event'
        );
    END IF;


      -- 4. The user is 'banned" to the event
    IF EXISTS (SELECT 1 FROM submits WHERE event_id = _event_id AND user_id = _user_id AND status = 'banned') THEN
        RETURN jsonb_build_object(
            'status', 'error',
            'message', 'Vous êtes exclu de cet événement'
        );
    END IF;


      -- 5. The user is not registered or cancelled to the event
    IF NOT EXISTS (SELECT 1 FROM submits WHERE event_id = _event_id AND user_id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 'error',
            'message', 'Vous n''êtes pas inscrit à cet événement'
        );
    END IF;

END;
$$;