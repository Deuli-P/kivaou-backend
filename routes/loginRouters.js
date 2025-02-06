import { Router } from 'express';
import { getSession, postLogin } from '../controllers/loginControllers.js';
const loginRouter = Router();


loginRouter.get('/session', getSession);
loginRouter.post('/login', postLogin);


export default loginRouter;