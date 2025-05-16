import { Router } from 'express';
import { createEvent, getEventActive, submitEvent, cancelSubmitEvent, getEventById, cancelEvent } from '../../controllers/event.js';
import { isMember, isOwner } from '../../middlewares/organizationMiddleware.js';
const eventRouter = Router();

eventRouter.get('/active', isMember, getEventActive );
eventRouter.post('/create', isMember, createEvent);
eventRouter.post('/submit', isMember, submitEvent);
eventRouter.post('/cancel', isMember, cancelSubmitEvent);
eventRouter.get('/:eventId', isMember, getEventById);
eventRouter.delete('/cancel/:eventId', isOwner, cancelEvent);


export default eventRouter;