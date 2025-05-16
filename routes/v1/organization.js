import { Router } from 'express';
import { addUserToOrganization, createOrganization, getOrganization, removeUserFromOrganization } from '../../controllers/organization.js';
import { isMember , isOwner} from '../../middlewares/organizationMiddleware.js';
const organisationRouter = Router();


organisationRouter.get('/:id', isMember, getOrganization );
organisationRouter.post('/create', createOrganization);
organisationRouter.put('/add-user/:email', isOwner, addUserToOrganization);
organisationRouter.delete('/remove-user/:userId', isOwner, removeUserFromOrganization);


export default organisationRouter;