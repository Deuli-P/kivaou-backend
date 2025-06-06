import { AdministrationModel } from "../models/AdministrationModel.js";



export const getAll = async (req, res) => {
    try{
        const user_id = req.user.id;

        if(!user_id){
            return res.status(400).json({
                message: 'Erreur lors de la récupération des données'
            });
        }

        const resultGetAll = await AdministrationModel.getAll([user_id]);

        if(resultGetAll.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de la récupération des données'
            });
        }

        const result = resultGetAll.rows[0].get_admin_all;

        return res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

export const deleteEvent = async (req, res) => {
    try{
        const user_id = req.user.id;
        const event_id = req.params.eventId;


        if(!event_id){
            return res.status(400).json({
                status : 400,
                message: "Erreur lors de l'annulation de l'événement"
            });
        };

        const resultDeleteEvent = await AdministrationModel.deleteEvent([event_id, user_id]);

        if(resultDeleteEvent.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: "Erreur lors de la suppression de l'événement"
            });
        }

        const result = resultDeleteEvent.rows[0].delete_event;

        return res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};


export const deleteOrganization = async (req, res) => {
    try{
        const user_id = req.user.id;
        const organization_id = req.params.organizationId;

        if(!organization_id){
            return res.status(400).json({
                status : 400,
                message: "Erreur lors de l'annulation de l'organisation"
            });
        };

        const resultDeleteOrganization = await AdministrationModel.deleteOrganization([organization_id, user_id]);

        if(resultDeleteOrganization.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: "Erreur lors de la suppression de l'organisation"
            });
        }

        const result = resultDeleteOrganization.rows[0].delete_organization;

        return res.status(result.status).json(result);
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};


export const deleteUser = async (req, res) => {
    try{

        const admin_id = req.user.id;
        const user_id = req.params.userId;

        if(!user_id){
            return res.status(400).json({
                status : 400,
                message: "Erreur lors de la suppression de l'utilisateur"
            });
        };

        const resultDeleteUser = await AdministrationModel.deleteUser([user_id, admin_id]);

        if(resultDeleteUser.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: "Erreur lors de la suppression de l'utilisateur"
            });
        }

        const result = resultDeleteUser.rows[0].delete_user;

        return res.status(result.status).json(result);
        
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
}