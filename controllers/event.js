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

        if(result.status = 204){
            return res.status(204).json({ 
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

export const getEvents = async (req, res) => {

    try{
        const organization_id = req.query.id;

        const filePathGetEvent = path.join("queries/event/getEvents.sql");
        const resultGetEvent = await executeQuery(filePathGetEvent, [organization_id]);

        if(resultGetEvent.rowCount === 0){
            return res.status(400).json({
                message: 'Aucun événement trouvé'
            });
        }

        const result = resultGetEvent.rows[0].get_event_by_id;

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