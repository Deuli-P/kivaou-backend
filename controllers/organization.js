import { OrganizationModel } from '../models/OrganizationModel.js';
import { regexEmail } from '../utils/utils.js';
import jwt from 'jsonwebtoken';

export const createOrganization = async (req, res) => {
    try{

        const user = req.user;

        const { name , number, street, city, postale_code, country } = req.body;
        if(!name.trim() || !number || !street.trim() || !city.trim() || !postale_code || !country.trim()){
            return res.status(400).json({message: 'Veuillez remplir tous les champs'});
        };

        console.log('number type', typeof number);
        console.log('number type stringer', typeof String(number));


        const resultCreateOrganization = await OrganizationModel.createOrganization([name.trim(), String(number), street.trim(), postale_code, city.trim(), country.trim(), user.id]);

        if(resultCreateOrganization.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de la création de l\'organisation'
            });
        }
        const result = resultCreateOrganization.rows[0].create_organization;
        

        req.user.organization_id = result.organization.id;
        req.user.organization_role = "OWNER";

        const token = jwt.sign({
            id: req.user.id,
            user_type: req.user.user_type,
            organization_id: req.user.organization_id,
            organization_role: req.user.organization_role
        }, process.env.JWT_SECRET, { expiresIn: "24h" });
  
      req.session.token = token;


        return res.status(result.status).json(result);

    }  
    catch(e){
        console.error(e);
        return res.status(500).json({ status: 500, message: "Erreur serveur lors de la création de l'organisation" });
    }
}; 

export const getOrganization = async (req, res) => {
    try{
        const user = req.user;
        const { id } = req.params;
        console.log("start getOrganization", id);

        const resultGetOrganizations = await OrganizationModel.getOrganization([id, user.id]);

        if(resultGetOrganizations.rowCount === 0){
            res.status(400).json({
                status: 400,
                message: 'Aucune organisation trouvée'
            });
        }
         
        const result = resultGetOrganizations.rows[0].get_organization_by_id;


        res.status(result.status).json(result);

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
        
        const organization_id = req.user.organization_id;
        
        if(!email.trim() || !regexEmail.test(email.trim())){
            return res.status(400).json({message: 'Email invalide'});
        }


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

        const resultRemoveUserFromOrganization = await OrganizationModel.removeUserFromOrganization([userId, user.id]);

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
