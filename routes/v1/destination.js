import { Router } from 'express';
import { isMember, isOwner } from '../../middlewares/organizationMiddleware.js';
import { getDestinations, createDestination } from '../../controllers/destination.js';
const destinationRouter = Router();


destinationRouter.get('/all',  isMember, getDestinations );
destinationRouter.post('/create', isOwner, createDestination);
//destinationRouter.delete('/delete',isConnected, isOwner, deleteEvent);



export default destinationRouter;