import { Router } from 'express';
import { createEvent, getEvents } from '../controllers/event.js';
import { isConnected } from '../middlewares/authMiddleware.js';
import { isMember } from '../middlewares/organizationMiddleware.js';
const eventRouter = Router();

eventRouter.get('/all', isConnected, isMember, getEvents );
//eventRouter.put('/edit',  isConnected, isMember, editEvent);
eventRouter.post('/create',isConnected, isMember, createEvent);
//eventRouter.delete('/delete',isConnected, isMember, deleteEvent);
//eventRouter.get('/personnal', );


export default eventRouter;