import jwt from 'jsonwebtoken';
import executeQuery from '../utils/dbReader.js';
import path from 'path';

// Check si la personne est dans l'organisation pour interagir avec elle

export const isMember = async (req, res, next) => {
    try{
        const sessionToken = req.session.token;

        const token = jwt.verify(sessionToken, process.env.JWT_SECRET);

        // je récupère l'id de l'organisation dans users puis je le cherche dans la table organization
        const response = 'SELECT check_middleware_organization($1)', [token.id];

        const response = resultOrganizationMiddleware.rows[0].get_organization_by_user_id;
        // Si l'utilisateur n'a pas d'organization alors on a un retour 404
        if(response = 404){
            return res.status(404).json({
                status: 404,
                message: "Aucune organisation trouvée"
            });
        }

        next();

    }
    catch(e){
        console.log("Erreur orgaMiddleware :", e)
    }
};
