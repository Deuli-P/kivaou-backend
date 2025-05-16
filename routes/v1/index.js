import { Router } from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import eventRouter from './event.js';
import organisationRouter from './organization.js';
import destinationRouter from './destination.js';
import { isAdmin } from '../../middlewares/adminMiddleware.js';
import { isConnected } from '../../middlewares/authMiddleware.js';
import adminRouter from './admin.js';


const v1Router = Router();


v1Router.use('/auth', authRouter);
v1Router.use('/user', isConnected, userRouter);
v1Router.use('/event', isConnected, eventRouter);
v1Router.use('/admin',isConnected, isAdmin, adminRouter);
v1Router.use('/destination',isConnected, destinationRouter);
v1Router.use('/organization',isConnected, organisationRouter);

export default v1Router;