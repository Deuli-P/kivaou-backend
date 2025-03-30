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