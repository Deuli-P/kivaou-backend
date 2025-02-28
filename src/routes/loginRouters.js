import { Router } from 'express';
import { postLogin, getLogout } from '../controllers/loginControllers.js';
const loginRouter = Router();


// loginRouter.get('/login', getSession);
loginRouter.post('/login', postLogin);

loginRouter.get('/logout', getLogout);


export default loginRouter;