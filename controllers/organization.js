import jwt from 'jsonwebtoken';
import executeQuery from '../utils/dbReader.js';
import path from 'path';


export const createOrganization = async (req, res) => {
    try{

        const sessionToken = req.session.token;

    
        if(!sessionToken){
            res.status(401).json({message: 'Non connecté'});
        }

        const token = jwt.verify(sessionToken, process.env.JWT_SECRET);

        if(!token){
            req.session.destroy();
            res.status(401).json({message: 'Non connecté'});
        }

        const { name , number, street, city, postal_code, country } = req.body;
        if(!name || !number || !street || !city || !postal_code || !country){
            res.status(400).json({message: 'Veuillez remplir tous les champs'});
        }
        const filePathCreateOrganization = path.join("queries/organization/createOrganization.sql");
        const resultCreateOrganization = await executeQuery(filePathCreateOrganization, [name, number, street, postal_code, city, country, token.id]);

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

        const sessionToken = req.session.token;

        if(!sessionToken){
            res.status(401).json({message: 'Non connecté'});
        }

        const token = jwt.verify(sessionToken, process.env.JWT_SECRET);

        if(!token){
            req.session.destroy();
            res.status(401).json({message: 'Non connecté'});
        }

        const { id } = req.params;

        const filePathGetOrganizations = path.join("queries/organization/getOrganization.sql");
        const resultGetOrganizations = await executeQuery(filePathGetOrganizations, [id]);

        if(resultGetOrganizations.rowCount === 0){
            res.status(400).json({message: 'Aucune organisation trouvée'});
        }
         

        const result = resultGetOrganizations.rows[0].get_organization_by_id;

        console.log('result', result)

        res.status(200).json({
            message: 'Organisations trouvées', 
            users: result.users,
            organization: result.organization_info,
            events: {
                past : result.past_events,
                future : result.future_events
            }

        });

    }  
    catch(e){
        console.error(e);
        res.status(500).json({ status: 500, message: "Erreur serveur lors de la récupération des organisations" });
    }
};

export const getOrganizationPlaces = async (req, res) => {
    try{
        const sessionToken = req.session.token;

        if(!sessionToken){
            res.status(401).json({message: 'Non connecté'});
        }

        const token = jwt.verify(sessionToken, process.env.JWT_SECRET);

        if(!token){
            req.session.destroy();
            res.status(401).json({message: 'Non connecté'});
        }

        const { id } = req.params;
        
        const filePathGetPlaces = path.join("queries/organization/getOrganizationPlaces.sql");
        const resultGetPlaces = await executeQuery(filePathGetPlaces, [id, token.id]);

        if(resultGetPlaces.rowCount === 0){
            res.status(400).json({message: 'Aucun lieu trouvé'});
        }
        const result = resultGetPlaces.rows[0].get_organization_places;
        console.log('result', result)

        if(result.length === 0){
            res.status(400).json({message: 'Aucun lieu trouvé'});
        }

        res.status(200).json({
            message: 'Lieux trouvés', 
            places: result
        });
    }
    catch(e){
        console.error(e);
        res.status(500).json({ status: 500, message: "Erreur serveur lors de la récupération des lieux" });
    }
};