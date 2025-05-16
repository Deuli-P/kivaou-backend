import { AdministrationModel } from "../models/AdministrationModel.js";


// Check si la personne est admin
export const isAdmin = async (req, res, next) => {
    try{

        const {id, user_type } = req.user;

        if(user_type !== 'admin') {
            return res.status(403).json({
                status: 403,
                message: 'Vous ne pouvez faire cette action'
            });
        };

        
        const resultAdmin = await AdministrationModel.administrationMiddleware([id]);

        if(resultAdmin.rowCount === 0){
            return res.status(403).json({
                status: 403,
                message: 'Vous ne pouvez faire cette action'
            });
        }

        const result = resultAdmin.rows[0].check_middleware_administrateur;

        if (result.status === 204) {
            next();
        } else {
            return res.status(403).json(result);
        }

    }
    catch(e){
        console.log("Erreur adminMiddleware :", e)
    }
};