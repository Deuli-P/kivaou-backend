CREATE OR REPLACE FUNCTION check_middleware_administrateur(
    _user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RETURN 404;
    END IF;

    -- Vérifier si l'utilisateur est administrateur de la plateforme
    IF NOT EXISTS (
        SELECT 1 
        FROM users
        LEFT JOIN auth a ON a.id = users.auth_id
        WHERE id = _user_id AND a.user_type = 'admin'
    ) THEN
        RETURN 403;
    END IF;

    RETURN 204;

END 
$$;