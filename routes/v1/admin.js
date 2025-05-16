import { Router } from 'express';
import { deleteEvent, deleteOrganization, deleteUser, getAll } from '../../controllers/admin.js';

const adminRouter = Router();


adminRouter.get('/all', getAll);
adminRouter.delete('/event/:eventId', deleteEvent);
adminRouter.delete('/organization/:organizationId', deleteOrganization);
adminRouter.delete('/user/:userId', deleteUser);


export default adminRouter;