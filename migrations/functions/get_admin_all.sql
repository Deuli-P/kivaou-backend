CREATE OR REPLACE FUNCTION get_admin_all(
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    _organizations JSONB;
    _events JSONB;
    _users JSONB;
BEGIN
    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users u WHERE u.id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message','L''utilisateur n''existe pas'
        );
    END IF;

    -- Vérifier si l'utilisateur est un admin
    IF NOT EXISTS (
        SELECT 1 
        FROM users
        LEFT JOIN auth a ON a.id = users.auth_id
        WHERE users.id = _user_id AND a.user_type = 'admin'
    ) THEN
        RETURN jsonb_build_object(
            'status', 403, 
            'message', 'Vous ne pouvez pas faire cette action'
        );
    END IF;

    
    -- Toutes les organisations
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', o.id,
            'name', o.name,
            'owner',jsonb_build_object(
                'id', owner.id,
                'firstname', owner.firstname,
                'lastname', owner.lastname,
                'photo_path', owner.photo_path
            ),
            'address', jsonb_build_object(
                'id', a.id,
                'number', a.street_number,
                'street', a.street,
                'postale_code', a.postale_code,
                'city', a.city,
                'country', a.country
            ),
            'users', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', u.id,
                        'firstname', u.firstname,
                        'lastname', u.lastname,
                        'photo_path', u.photo_path
                    )
                )
                FROM users u
                WHERE u.organization_id = o.id AND u.deleted_at IS NULL
            )
        )
    ) INTO _organizations
    FROM organizations o
    LEFT JOIN address a ON a.id = o.address_id
    LEFT JOIN users owner ON owner.id = o.owner_id
    WHERE o.deleted_at IS NULL;
    -- -- Tous les événements
    SELECT jsonb_agg(e.event) INTO _events
    FROM (
        SELECT jsonb_build_object(
            'id', e.id,
            'title', e.title,
            'description', e.description,
            'start_date', e.start_date,
            'end_date', e.end_date,
            'organization', jsonb_build_object(
                'id', o.id,
                'name', o.name
            ),
            'owner', jsonb_build_object(
                'id', owner.id,
                'firstname', owner.firstname,
                'lastname', owner.lastname,
                'photo_path', owner.photo_path
            ),
            'destination', jsonb_build_object(
                'id', d.id,
                'name', d.name,
                'address',jsonb_build_object(
                    'id', a.id,
                    'number', a.street_number,
                    'street', a.street,
                    'postale_code', a.postale_code,
                    'city', a.city,
                    'country', a.country
                )
            ),
            'status', e.status,
            'users', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', u.id,
                        'firstname', u.firstname,
                        'lastname', u.lastname,
                        'photo_path', u.photo_path
                    )
                )
                FROM submits s
                LEFT JOIN users u ON u.id = s.user_id
                WHERE s.event_id = e.id
            )
        ) AS event
        FROM events e
        LEFT JOIN organizations o ON o.id = e.organization_id
        LEFT JOIN users owner ON owner.id = e.created_by
        LEFT JOIN destinations d ON d.id = e.destinations_id
        LEFT JOIN address a ON a.id = d.address_id
        WHERE e.deleted_at IS NULL
    ) e;

    -- Tous les utilisateurs
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', u.id,
            'firstname', u.firstname,
            'lastname', u.lastname,
            'photo_path', u.photo_path
        )
    ) INTO _users
    FROM users u
    LEFT JOIN auth a ON a.id = u.auth_id
    WHERE u.deleted_at IS NULL AND a.user_type != 'admin';


    RETURN jsonb_build_object(
        'status', 200, 
        'message', 'Succès',
        'events', COALESCE(_events, '[]'::jsonb),
        'organizations', COALESCE(_organizations, '[]'::jsonb),
        'users', COALESCE(_users, '[]'::jsonb)
    );
END;
$$;