import { Router } from 'express';
import { getSession, getLogin, getLogout, createUser } from '../controllers/auth.js';
const authRouter = Router();


authRouter.get('/check', getSession);
authRouter.post('/login', getLogin);
authRouter.get('/logout', getLogout);
authRouter.post('/register', createUser);


export default authRouter;