import { Router } from 'express';
import { getSession, postLogin } from '../controllers/loginControllers.js';
const authRouter = Router();


authRouter.get('/logout', getLogout);
authRouter.post('/login', postLogin);
authRouter.get('/check', getSession);


export default authRouter;