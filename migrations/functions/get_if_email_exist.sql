CREATE OR REPLACE FUNCTION get_if_email_exist(
    _email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE 
    _exists BOOLEAN;
BEGIN

    SELECT EXISTS (
        SELECT 1 FROM auth WHERE email = _email
    ) INTO _exists;

    RETURN _exists;

END;
$$;