import executeQuery from '../utils/dbReader.js';
import path from 'path';

export const createEvent = async (req, res) => {
    try{
        console.log("createEvent");
        const { name, description, start_date, end_date, organization_id, destination_id } = req.body;

        if(!name || !start_date || !organization_id){
            res.status(400).json({
                message: 'Veuillez remplir tous les champs obligatoires'
            });
        }

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
        const resultCreateEvent = await executeQuery(filePathCreateEvent, [name, description, start_date, end_date, destination_id, organization_id, req.user.id]);

        if(resultCreateEvent.rowCount === 0){
            res.status(400).json({
                message: 'Erreur lors de la création de l\'événement'
            });
        }
        const result = resultCreateEvent.rows[0].create_event;

        res.status(200).json({
            message: 'Événement créé', 
            event: result
        });
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

export const getEvent = async (req, res) => {
};

export const editEvent = async (req, res) => {
};

export const deleteEvent = async (req, res) => {
};