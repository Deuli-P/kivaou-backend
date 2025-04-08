import { Router } from 'express';
import { getSession, getLogin, getLogout, createUser } from '../controllers/auth.js';
import { isConnected } from '../middlewares/authMiddleware.js';
const authRouter = Router();


authRouter.get('/check',isConnected, getSession);
authRouter.post('/login', getLogin);
authRouter.get('/logout',isConnected, getLogout);
authRouter.post('/register', createUser);


export default authRouter;