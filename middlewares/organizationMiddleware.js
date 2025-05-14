import { type } from 'os';
import { OrganizationModel } from '../models/OrganizationModel.js';


export const isMember = async (req, res, next) => {
    try {

        const user = req.user;

        console.log('start orgaMiddleware');


        const id= req.params.id || req.query.id;


        if (!id || id=== 'null' || id === null) {
            return res.status(204).end();
        }

        const resultMiddlewareOrganizations = await OrganizationModel.organizationMiddlewareMember([user.id, id]);

        const result = resultMiddlewareOrganizations.rows[0].check_middleware_organization;


        if (result === 404) {
            return res.status(404).json({
                message: 'Utilisateur non membre de cette organisation ou organisation introuvable'
            }); 
        }

        if( result === 200){
            req.user.organization = {
                id: id
            };
    
            next();
        }
        else{
            return res.status(204).end();
        }

    } catch (e) {
        console.log("==============================================")
        console.log('Erreur orgaMiddleware :', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const isOwner = async (req, res,next) => {
    try {

        const user = req.user;

        const id = req.params.id || req.query.id;


        if(!id || id === 'null' || id === null ){
            return res.status(204).end()
        }

        const resultMiddlewareOrganizations = await OrganizationModel.organizationMiddlewareOwner([user.id, id]);

        const result = resultMiddlewareOrganizations.rows[0].check_middleware_owner;

        if (result === 404) {
            return res.status(404).json({
                message: 'Utilisateur non membre de cette organisation ou organisation introuvable'
            }); 
        }

        if (result === 402) {
            return res.status(402).json({
                message: "Utilisateur n'est pas propriétaire de cette organisation"
            }); 
        }

        if( result === 200){
            req.user.organization = {
                id: id,
                role: 'owner'
            };
    
            next();
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