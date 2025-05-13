import { Router } from 'express';
import { addUserToOrganization, createOrganization, getOrganizations, removeUserFromOrganization } from '../controllers/organization.js';
import { isMember , isOwner} from '../middlewares/organizationMiddleware.js';
import { isConnected } from '../middlewares/authMiddleware.js';
const organisationRouter = Router();


organisationRouter.get('/:id',isConnected, isMember, getOrganizations );
organisationRouter.post('/create',isConnected, createOrganization);
organisationRouter.put('/add-user/:email', isConnected, isOwner, addUserToOrganization);
organisationRouter.post('/remove-user/:userId',isConnected, isOwner, removeUserFromOrganization);


export default organisationRouter;