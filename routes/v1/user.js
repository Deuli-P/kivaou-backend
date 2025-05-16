import { Router } from 'express';
import { getUser, updateUser } from '../../controllers/user.js';
const userRouter = Router();
import { isConnected } from '../../middlewares/authMiddleware.js';


userRouter.get('', getUser );
userRouter.put('/edit', updateUser);



export default userRouter;