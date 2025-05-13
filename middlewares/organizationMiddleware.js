import { OrganizationModel } from '../models/OrganizationModel.js';


export const isMember = async (req, res, next) => {
    try {

        const user = req.user;

        const id = req.params.id || req.query.id;


        const resultMiddlewareOrganizations = await OrganizationModel.organizationMiddlewareMember([user.id, id]);

        const resultRow = resultMiddlewareOrganizations.rows[0].check_middleware_organization;

        if (resultRow === 404) {
            return res.status(404).json({
                message: 'Utilisateur non membre de cette organisation ou organisation introuvable'
            }); 
        }

        req.user.organization = {
            id: id
        };
        
        next();

    } catch (e) {
        console.log('Erreur orgaMiddleware :', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const isOwner = async (req, res,next) => {
    try {

        const user = req.user;

        const id = req.params.id || req.query.id;



        const resultMiddlewareOrganizations = await OrganizationModel.organizationMiddlewareOwner([user.id, id]);

        const resultRow = resultMiddlewareOrganizations.rows[0].check_middleware_owner;

        if (resultRow === 504) {
            return res.status(404).json({
                message: 'Utilisateur non membre de cette organisation ou organisation introuvable'
            }); 
        }

        if (resultRow === 404) {
            return res.status(404).json({
                message: 'Utilisateur n\'est pas propriétaire de cette organisation'
            }); 
        }

        req.user.organization = {
            id: id,
            role: 'owner'
        };
        
        next();

    } catch (e) {
        console.log('Erreur orgaMiddleware :', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }

} 