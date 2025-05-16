import { Router } from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import eventRouter from './event.js';
import organisationRouter from './organization.js';
import destinationRouter from './destination.js';


const v1Router = Router();



v1Router.use('/user', userRouter)
v1Router.use('/auth', authRouter)
v1Router.use('/event', eventRouter)
v1Router.use('/destination', destinationRouter)
v1Router.use('/organization', organisationRouter)

export default v1Router;