import executeQuery from '../utils/dbReader.js';
import path from 'path';

export const createEvent = async (req, res) => {
    try{
        console.log("createEvent");

        const { title, description, start_date, end_date, place } = req.body;
        const destination_id = place;

        const organization_id = req.query.id;

        if(!title || !start_date || !destination_id){
            return res.status(400).json({
                message: 'Veuillez remplir tous les champs obligatoires'
            });
        };


        if (new Date(start_date) < new Date()) {
            return res.status(400).json({
                message: 'La date de début ne doit pas être dans le passé'
            });
        }

        if(new Date(end_date) < new Date(start_date)){
            return res.status(400).json({
                message: 'La date de fin ne doit pas être avant la date de début'
            });
        }

        
        const filePathCreateEvent = path.join("queries/event/createEvent.sql");
        const resultCreateEvent = await executeQuery(filePathCreateEvent, [title, start_date, end_date, destination_id, organization_id, req.user.id, description]);

        if(resultCreateEvent.rowCount === 0){
            return res.status(400).json({
                message: 'Erreur lors de la création de l\'événement'
            });
        }
        const result = resultCreateEvent.rows[0].create_event;

        console.log('result', result);

        res.status(result.status).json(result);
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: "Erreur serveur lors de la création de l'événement"
        });
    }
};

export const getEventActive = async (req, res) => {

    try{
        const organization_id = req.query.id;

        const filePathGetEvent = path.join("queries/event/getEventsActive.sql");
        const resultGetEvent = await executeQuery(filePathGetEvent, [organization_id, req.user.id]);


        if(resultGetEvent.rowCount === 0){
            return res.status(400).json({
                message: 'Aucun événement trouvé'
            });
        }

        const result = resultGetEvent.rows[0].get_all_events_active_by_organization_id;

        return res.status(200).json({
            result
        });

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

export const editEvent = async (req, res) => {
};

export const deleteEvent = async (req, res) => {
};

export const submitEvent = async (req, res) => {
    try{
        const event_id = req.body.eventId;

        console.log('body :', req.body);
        if(!event_id){
            return res.status(400).json({
                message: 'Erreur lors de la soumission de l\'événement'
            });
        };

        const user_id = req.user.id;

        const filePathSubmitEvent = path.join("queries/event/submitEvent.sql");
        const resultSubmitEvent = await executeQuery(filePathSubmitEvent, [event_id, user_id]);

        if(resultSubmitEvent.rowCount === 0){
            return res.status(400).json({
                message: 'Erreur lors de la soumission de l\'événement'
            });
        }

        const result = resultSubmitEvent.rows[0].submit_event;

        console.log("result", result);

        if(result.status = 'success'){
            return res.status(200).json({ 
                result
            });
        }
        else {
            return res.status(400).json({
                result
            });
        }
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

export const cancelSubmitEvent = async (req, res) => {
    try{
        const event_id = req.body.eventId;
        const user_id = req.user.id;

        const filePathCancelSubmitEvent = path.join("queries/event/cancelSubmitEvent.sql");
        const resultCancelSubmitEvent = await executeQuery(filePathCancelSubmitEvent, [event_id, user_id]);

        if(resultCancelSubmitEvent.rowCount === 0){
            return res.status(400).json({
                message: 'Erreur lors de l\'annulation de la soumission de l\'événement'
            });
        }

        const result = resultCancelSubmitEvent.rows[0].cancel_submit_event;

        console.log("result", result);

        if (result.status === 'success') {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

export const getEventById = async (req, res) => {
    try{
        const { id } = req.params;
        const user_id = req.user.id;
        const organization_id = req.query.id;

        // Check si event_id 
        if(!id || !organization_id){
            return res.status(400).json({
                message: 'Erreur lors de la récupération de l\'événement'
            });
        };

        const filePathGetEvent = path.join("queries/event/createEvent.sql");
        const resultGetEvent = await executeQuery(filePathGetEvent, [ organization_id, id, user_id]);

        if(resultGetEvent.rowCount === 0){
            return res.status(400).json({
                message: 'Erreur lors de la création de l\'événement'
            });
        }
        const result = resultGetEvent.rows[0].get_event_by_id;

        console.log('result', result);

        res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};