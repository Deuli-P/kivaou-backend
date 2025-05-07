CREATE OR REPLACE FUNCTION delete_destination(
   _id UUID,
   _user_id UUID
) 
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE 
    _organization_id UUID;
    _address_id UUID;
BEGIN

    -- Vérifier si la destination existe
    IF NOT EXISTS (SELECT 1 FROM destinations WHERE id = _id) THEN
        RETURN jsonb_build_object('status', 404, 'message', format('Destination with ID % does not exist', _id));
    END IF;

    -- Recupérer l'organisation de la destination
    SELECT organization_id, 
           address_id
    INTO _organization_id, _address_id
    FROM destinations
    WHERE id = _id;

    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = _user_id) THEN
        RETURN jsonb_build_object('status', 404, 'message', format('User with ID % does not exist', _user_id));
    END IF;


    -- Vérifier si le user est bien owner de l'organisation
    IF NOT EXISTS (
        SELECT 1 FROM organizations
        WHERE id = _organization_id AND owner_id = _user_id
    ) THEN
        RETURN jsonb_build_object('status', 403, 'message', 'User is not the owner of the organization');
    END IF;


    -- Vérifier si la destination n'est pas dans un event en cours
    IF EXISTS (
        SELECT 1 FROM events 
        WHERE destination_id = _id AND event_status = 'started'
    ) THEN
        RETURN jsonb_build_object('status', 404, 'message', 'Destination is in an event actif');
    END IF;

    -- Supprimer la destination
    DELETE FROM destinations
    WHERE id = _id;

    -- Supprimer l'adresse
    DELETE FROM address
    WHERE id = _address_id;
    

    -- Succès
    RETURN jsonb_build_object('status', 200, 'message', 'Destination deleted successfully');

END;
$$;