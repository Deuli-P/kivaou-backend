import { Router } from 'express';
import { updateUser } from '../controllers/user.js';
const userRouter = Router();


userRouter.get('/:id', );
userRouter.put('/edit', updateUser);
userRouter.post('/create', );
userRouter.delete('/delete', );
userRouter.get('/personnal', );


export default userRouter;