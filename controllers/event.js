import { EventModel } from '../models/EventModel.js';

export const createEvent = async (req, res) => {
    try{

        const { title, description, start_date, end_date, place } = req.body;
        const destination_id = place;

        const organization_id = req.user.organization_id;

        if(!title.trim() || !start_date || !destination_id){
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

        
        const resultCreateEvent = await EventModel.createEvent([title.trim(), start_date, end_date, destination_id, organization_id, req.user.id, description.trim()]);

        if(resultCreateEvent.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de la création de l\'événement'
            });
        }
        const result = resultCreateEvent.rows[0].create_event;


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
        const {id:user_id , organization_id} = req.user;

        const resultGetEvent = await EventModel.getEvents([organization_id, user_id]);

        if(resultGetEvent.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Aucun événement trouvé'
            });
        }

        const result = resultGetEvent.rows[0].get_all_events_active_by_organization_id;

        return res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

export const cancelEvent = async (req, res) => {
    try{
        const user_id = req.user.id;
        const event_id = req.params.eventId;
        const organization_id = req.user.organization_id;
        const organization_role = req.user.organization_role;

        if(!event_id || !organization_id){
            return res.status(400).json({
                message: 'Erreur lors de l\'annulation de l\'événement'
            });
        }

        if(organization_role !== 'OWNER'){
            return res.status(403).json({
                message: 'Vous n\'avez pas les droits nécessaires pour annuler cet événement'
            });
        }

        const resultCancelEvent = await EventModel.cancelEvent([event_id, organization_id, user_id]);

        if(resultCancelEvent.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de l\'annulation de l\'événement'
            });
        }

        const result = resultCancelEvent.rows[0].cancel_event;

        return res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

export const submitEvent = async (req, res) => {
    try{
        const event_id = req.body.eventId;

        if(!event_id){
            return res.status(400).json({
                message: 'Erreur lors de la soumission de l\'événement'
            });
        };

        const user_id = req.user.id;

        const resultSubmitEvent = await EventModel.submitEvent([event_id, user_id]);

        if(resultSubmitEvent.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de la soumission de l\'événement'
            });
        }

        const result = resultSubmitEvent.rows[0].submit_event;


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

        const resultCancelSubmitEvent = await EventModel.cancelSubmitEvent([event_id, user_id]);

        if(resultCancelSubmitEvent.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de l\'annulation de la soumission de l\'événement'
            });
        }

        const result = resultCancelSubmitEvent.rows[0].cancel_submit_event;


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
        const { eventId } = req.params;
        const user_id = req.user.id;

        // Check si event_id 
        if(!eventId || eventId === 'null' || eventId === null){
            return res.status(400).json({
                message: "Erreur lors de la récupération de l'événement"
            });
        };

        const resultGetEvent = await EventModel.getEventById([eventId, user_id]);

        if(resultGetEvent.rowCount === 0){
            return res.status(400).json({
                status:'400',
                message: "Erreur lors de la création de l'événement"
            });
        }
        const result = resultGetEvent.rows[0].get_event_by_id;
        res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: "Erreur serveur"
        });
    }
};