import { Router } from 'express';
import { getUser, updateUser } from '../controllers/user.js';
const userRouter = Router();
import { isConnected } from '../middlewares/authMiddleware.js';


userRouter.get('', isConnected, getUser );
userRouter.put('/edit',isConnected, updateUser);
userRouter.post('/create', );
userRouter.delete('/delete', );
userRouter.get('/personnal', );


export default userRouter;