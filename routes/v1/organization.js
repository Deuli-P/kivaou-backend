import { Router } from 'express';
import { addUserToOrganization, createOrganization, getOrganization, removeUserFromOrganization } from '../../controllers/organization.js';
import { isMember , isOwner} from '../../middlewares/organizationMiddleware.js';
import { isConnected } from '../../middlewares/authMiddleware.js';
const organisationRouter = Router();


organisationRouter.get('/:id',isConnected, isMember, getOrganization );
organisationRouter.post('/create',isConnected, createOrganization);
organisationRouter.put('/add-user/:email', isConnected, isOwner, addUserToOrganization);
organisationRouter.delete('/remove-user/:userId',isConnected, isOwner, removeUserFromOrganization);


export default organisationRouter;