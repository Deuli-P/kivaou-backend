import { Router } from 'express';
import { createOrganization, getOrganizations } from '../controllers/organization.js';
import { isMember } from '../middlewares/organizationMiddleware.js';
import { isConnected } from '../middlewares/authMiddleware.js';
const organisationRouter = Router();


organisationRouter.get('/:id',isConnected, isMember, getOrganizations );
//organisationRouter.put('/edit', isConnected, isMember, editOrganization);
organisationRouter.post('/create',isConnected, createOrganization);
//organisationRouter.delete('/delete',isConnected, isMember, deleteOrganization);


export default organisationRouter;