import { Router } from 'express';
import { createEvent, getEventActive, submitEvent, cancelSubmitEvent, getEventById } from '../controllers/event.js';
import { isConnected } from '../middlewares/authMiddleware.js';
import { isMember } from '../middlewares/organizationMiddleware.js';
const eventRouter = Router();

eventRouter.get('/active', isConnected, isMember, getEventActive );
eventRouter.post('/create',isConnected, isMember, createEvent);
eventRouter.post('/submit', isConnected, isMember, submitEvent);
eventRouter.post('/cancel', isConnected, isMember, cancelSubmitEvent);
eventRouter.get('/:id', isConnected, isMember, getEventById);


export default eventRouter;