import { OrganizationModel } from '../models/OrganizationModel.js';
import { regexEmail } from '../utils/utils.js';


export const createOrganization = async (req, res) => {
    try{

        const user = req.user;


        const { name , number, street, city, postale_code, country } = req.body;
        if(!name.trim() || !number || !street.trim() || !city.trim() || !postale_code || !country.trim()){
            return res.status(400).json({message: 'Veuillez remplir tous les champs'});
        };

        const resultCreateOrganization = await OrganizationModel.createOrganization([name.trim(), number, street.trim(), postale_code, city.trim(), country.trim(), user.id]);

        if(resultCreateOrganization.rowCount === 0){
            return res.status(400).json({message: 'Erreur lors de la création de l\'organisation'});
        }
        const result = resultCreateOrganization.rows[0].create_organization;

        return res.status(result.status).json(result);

    }  
    catch(e){
        console.error(e);
        return res.status(500).json({ status: 500, message: "Erreur serveur lors de la création de l'organisation" });
    }
}; 

export const getOrganizations = async (req, res) => {
    try{
        const user = req.user;
        const { id } = req.params;

        const resultGetOrganizations = await OrganizationModel.getOrganization([id, user.id]);

        if(resultGetOrganizations.rowCount === 0){
            res.status(400).json({message: 'Aucune organisation trouvée'});
        }
         
        const result = resultGetOrganizations.rows[0].get_organization_by_id;


        res.status(200).json({
            message: 'Organisations trouvées', 
            users: result.users,
            organization: result.organization_info,
            events: {
                past : result.past_events,
                future : result.events_future
            },
            destinations: result.destinations

        });

    }  
    catch(e){
        console.error(e);
        return res.status(500).json({ 
            status: 500, 
            message: "Erreur serveur lors de la récupération des organisations" 
        });
    }
};

export const addUserToOrganization = async (req, res) => {
    try{
        const user = req.user;

        const { email } = req.params;

        console.log('stat add user to org', email);
        
        if(!email.trim() || !regexEmail.test(email.trim())){
            return res.status(400).json({message: 'Email invalide'});
        }


        const organization_id = req.user.organization.id;

        const resultAddUserToOrganization = await OrganizationModel.addUserToOrganization([email, organization_id, user.id]);

        if (resultAddUserToOrganization.rowCount === 0) {
            return res.status(500).json({
                status: 500,
                message: "Erreur serveur lors de l'ajout de l'utilisateur à l'organisation"
            });
        }

        const result = resultAddUserToOrganization.rows[0].add_user_to_organization;

        res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur'});
    }
};

export const removeUserFromOrganization = async (req, res) => {
    try{
        const user = req.user;

        const { userId } = req.params;

        if(!userId){
            return res.status(400).json({message: 'Erreur lors de la récupération de l\'utilisateur'});
        };

        const organization_id = req.user.organization.id;

        const resultRemoveUserFromOrganization = await OrganizationModel.removeUserFromOrganization([userId, organization_id, user.id]);

        if (resultRemoveUserFromOrganization.rowCount === 0) {
            return res.status(500).json({
                status: 500,
                message: "Erreur serveur lors de la suppression de l'utilisateur de l'organisation"
            });
        }

        const result = resultRemoveUserFromOrganization.rows[0].remove_user_from_organization;

        res.status(result.status).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur'});
    }
};
