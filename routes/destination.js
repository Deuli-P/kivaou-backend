import { Router } from 'express';
import { isMember, isOwner } from '../middlewares/organizationMiddleware.js';
import { isConnected } from '../middlewares/authMiddleware.js';
import { getDestinations, createDestionation } from '../controllers/destination.js';
const destinationRouter = Router();


destinationRouter.get('/all', isConnected, isMember, getDestinations );
//destinationRouter.put('/edit',  isConnected, isMember, editEvent);
destinationRouter.post('/create', isConnected ,isOwner, createDestionation);
//destinationRouter.delete('/delete',isConnected, isMember, deleteEvent);
//destinationRouter.get('/personnal', );


export default destinationRouter;