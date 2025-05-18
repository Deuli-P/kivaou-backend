CREATE OR REPLACE FUNCTION check_middleware_administrateur(
    _user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users u WHERE u.id = _user_id) THEN
        RETURN jsonb_build_object(
            'status', 404, 
            'message', 'L''utilisateur n''existe pas'
        );
    END IF;

    -- Vérifier si l'utilisateur est administrateur de la plateforme
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

    RETURN jsonb_build_object(
        'status', 200, 
        'message', 'L''utilisateur est administrateur de la plateforme'
    );

END 
$$;