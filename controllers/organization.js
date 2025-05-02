import executeQuery from '../utils/dbReader.js';
import path from 'path';


export const createOrganization = async (req, res) => {
    try{

        const user = req.user;

        const { name , number, street, city, postal_code, country } = req.body;
        if(!name || !number || !street || !city || !postal_code || !country){
            res.status(400).json({message: 'Veuillez remplir tous les champs'});
        }
        const filePathCreateOrganization = path.join("queries/organization/createOrganization.sql");
        const resultCreateOrganization = await executeQuery(filePathCreateOrganization, [name, number, street, postal_code, city, country, user.id]);

        if(resultCreateOrganization.rowCount === 0){
            res.status(400).json({message: 'Erreur lors de la création de l\'organisation'});
        }
        const result = resultCreateOrganization.rows[0].create_organization;

        res.status(200).json({message: 'Organisation créée', organization: result});

    }  
    catch(e){
        console.error(e);
        res.status(500).json({ status: 500, message: "Erreur serveur lors de la création de l'organisation" });
    }
}; 

export const getOrganizations = async (req, res) => {
    try{
        const user = req.user;
        const { id } = req.params;

        const filePathGetOrganizations = path.join("queries/organization/getOrganization.sql");
        const resultGetOrganizations = await executeQuery(filePathGetOrganizations, [id, user.id]);

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
                future : result.future_events
            },
            destinations: result.destinations

        });

    }  
    catch(e){
        console.error(e);
        return res.status(500).json({ status: 500, message: "Erreur serveur lors de la récupération des organisations" });
    }
};
