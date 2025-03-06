import { Router } from 'express';
import { getSession, postLogin, getLogout } from '../controllers/auth.js';
const authRouter = Router();


authRouter.get('/check', getSession);
authRouter.post('/login', postLogin);
authRouter.get('/logout', getLogout);


export default authRouter;