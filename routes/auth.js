import { Router } from 'express';
import { getSession, postLogin, getLogout, createUser } from '../controllers/auth.js';
const authRouter = Router();


authRouter.get('/check', getSession);
authRouter.post('/login', postLogin);
authRouter.get('/logout', getLogout);
authRouter.post('/register', createUser);


export default authRouter;