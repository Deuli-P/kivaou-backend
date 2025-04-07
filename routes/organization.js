import { Router } from 'express';
import { createOrganization, getOrganizationPlaces, getOrganizations } from '../controllers/organization.js';
import { isMember } from '../middlewares/organizationMiddleware.js';
const organisationRouter = Router();


organisationRouter.get('/:id',isMember, getOrganizations );
//organisationRouter.put('/edit' );
organisationRouter.post('/create', createOrganization);
//organisationRouter.delete('/delete', );
organisationRouter.get('/:id/places', isMember, getOrganizationPlaces);


export default organisationRouter;