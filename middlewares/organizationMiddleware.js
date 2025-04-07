import jwt from 'jsonwebtoken';
import executeQuery from '../utils/dbReader.js';
import path from 'path';


export const isMember = async (req, res, next) => {
    try {
        const sessionToken = req.session.token;


        if (!sessionToken) {
            return res.status(401).json({ message: 'Non connecté' });
        }

        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);

        const { id } = req.params;

        const filePathMiddlewareOrganizations = path.join("queries/middlewares/organization.sql");
        const resultMiddlewareOrganizations = await executeQuery(filePathMiddlewareOrganizations, [decoded.id, id]);

        const resultRow = resultMiddlewareOrganizations.rows[0].check_middleware_organization;

        if (resultRow === 404) {
            return res.status(404).json({
                message: 'Utilisateur non membre de cette organisation ou organisation introuvable'
            }); 
        }
        next();

    } catch (e) {
        console.log('Erreur orgaMiddleware :', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};