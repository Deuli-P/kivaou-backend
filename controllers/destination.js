import { DestinationModel } from '../models/DestinationModel.js';


export const getDestinations = async (req, res) => {
    try{

        const user = req.user;

        const id = req.params.id;
        
        const resultGetPlaces = await DestinationModel.getDestinations([id, user.id]);

        if(resultGetPlaces.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de la récupération des lieux'
            });
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

export const createDestination = async (req, res) => {
    try{
        const {id, organization_id} = req.user;



        const { name, number, street, city, postale_code, schedule, country, service_type, website, service_link, google_map, speciality, phone, photo_path, longitude, latitude } = req.body;

        console.log('type of number', typeof number);

        if(!name.trim() || !number.trim() || !street.trim() || !city.trim() || !postale_code || !country.trim() || !phone.trim() || !service_type.trim() || !speciality.trim()){
            return res.status(400).json({message: 'Veuillez remplir tous les champs'});
        }

        if (schedule && !Array.isArray(schedule)) {
            return res.status(400).json({ message: 'Schedule doit être un tableau JSON valide.' });
          }
          
        const jsonSchedule = schedule ? JSON.stringify(schedule) : null;

        const resultCreateDestination = await DestinationModel.createDestination([name.trim(), organization_id, number.trim(), street.trim(), postale_code, city.trim(), country.trim(), longitude?.trim(), latitude?.trim(), id, service_type.trim(), service_link?.trim(), jsonSchedule, photo_path?.trim(), google_map?.trim(), speciality.trim(), phone?.trim(), website?.trim()]);

        if(resultCreateDestination.rowCount === 0){
            return res.status(400).json({
                status: 400,
                message: 'Erreur lors de la création du lieu'
            });
        }
        const result = resultCreateDestination.rows[0].create_destination;

        return res.status(result.status).json(result);
    }  
    catch(e){
        console.error(e);
        res.status(500).json({ status: 500, message: "Erreur serveur lors de la création du lieu" });
    }
};