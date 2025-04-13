import executeQuery from '../utils/dbReader.js';
import path from 'path';


export const getDestinations = async (req, res) => {
    try{

        const user = req.user;

        const id = req.query.id;
        
        const filePathGetPlaces = path.join("queries/destination/getDestinations.sql");
        const resultGetPlaces = await executeQuery(filePathGetPlaces, [id, user.id]);

        if(resultGetPlaces.rowCount === 0){
            return res.status(400).json({message: 'Erreur lors de la récupération des lieux'});
        }
        const result = resultGetPlaces.rows[0].get_destinations;


        return res.status(200).json({
            message: 'Lieux trouvés', 
            places: result
        });
    }
    catch(e){
        console.error(e);
        res.status(500).json({ status: 500, message: "Erreur serveur lors de la récupération des lieux" });
    }
};

export const createDestionation = async (req, res) => {
    try{
        const user = req.user;

        const id = req.query.id;

        const { name, number, street, city, postal_code, schedule, country, service_type, website, service_link, google_map, speciality, phone, photo_path, longitude, latitude } = req.body;

        if(!name  || !street || !city || !postal_code || !country || !phone || !service_type || !speciality){
            return res.status(400).json({message: 'Veuillez remplir tous les champs'});
        }
        const filePathCreateDestination = path.join("queries/destination/createDestination.sql");
        const resultCreateDestination = await executeQuery(filePathCreateDestination, [name, id, number, street, postal_code, city, country, longitude, latitude, user.id, service_type, service_link, schedule, photo_path, google_map, speciality, phone, website]);

        if(resultCreateDestination.rowCount === 0){
            return res.status(400).json({message: 'Erreur lors de la création du lieu'});
        }
        const result = resultCreateDestination.rows[0].create_destination;

        return res.status(200).json({message: 'Lieu créé', destination: result});
    }  
    catch(e){
        console.error(e);
        res.status(500).json({ status: 500, message: "Erreur serveur lors de la création du lieu" });
    }
}