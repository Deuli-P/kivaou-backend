import { OrganizationModel } from '../models/OrganizationModel.js';


export const isMember = async (req, res, next) => {
    try {

        const {id, organization_id, user_type} = req.user;


        if(user_type === 'admin'){

            return next();
        }
        if (!organization_id || organization_id=== 'null' || organization_id === null ){
            return res.status(204).end();
        }

        const resultMiddlewareOrganizations = await OrganizationModel.organizationMiddlewareMember([id, organization_id]);

        const result = resultMiddlewareOrganizations.rows[0].check_middleware_organization;


        if (result === 404) {
            return res.status(404).json({
                message: 'Utilisateur non membre de cette organisation ou organisation introuvable'
            }); 
        }

        if( result === 200){
            next();
        }
        else{
            return res.status(204).end();
        }

    } catch (e) {
        console.log('Erreur orgaMiddleware :', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const isOwner = async (req, res,next) => {
    try {

        const {id, organization_id} = req.user;

        const organization_id_send = req.params.id || req.query.id;

        if (!organization_id_send || organization_id_send=== 'null' || organization_id_send=== null || !organization_id || organization_id=== 'null' || organization_id=== null){
            return res.status(204).end();
        }

        if( organization_id_send !== organization_id){
            return res.status(403).json({
                status : 403,
                message: 'Utilisateur non administrateur de cette organisation'
            })
        };


        const resultMiddlewareOrganizations = await OrganizationModel.organizationMiddlewareOwner([id, organization_id_send]);

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
            next();
        }
        else{
            return res.status(204).end();
        }

    } catch (e) {
        console.log('Erreur orgaMiddleware :', e);
        return res.status(500).json({ message: 'Erreur serveur' });
    }

} 