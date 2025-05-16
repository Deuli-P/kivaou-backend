import { Router } from 'express';
import { createEvent, getEventActive, submitEvent, cancelSubmitEvent, getEventById, deleteEvent, cancelEvent } from '../../controllers/event.js';
import { isConnected } from '../../middlewares/authMiddleware.js';
import { isMember, isOwner } from '../../middlewares/organizationMiddleware.js';
import { isAdmin } from '../../middlewares/adminMiddleware.js';
const eventRouter = Router();

eventRouter.get('/active', isConnected, isMember, getEventActive );
eventRouter.post('/create',isConnected, isMember, createEvent);
eventRouter.post('/submit', isConnected, isMember, submitEvent);
eventRouter.post('/cancel', isConnected, isMember, cancelSubmitEvent);
eventRouter.get('/:eventId', isConnected, isMember, getEventById);
eventRouter.delete('/delete/:eventId', isConnected, isAdmin, deleteEvent);
eventRouter.delete('/cancel/:eventId', isConnected, isOwner, cancelEvent);


export default eventRouter;