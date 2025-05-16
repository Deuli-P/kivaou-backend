import { Router } from 'express';
import v1Router from './v1/index.js';



const router = Router();


router.use('/v1', v1Router);

router.get('/test', (req, res) => {
    res.status(200).json({
      message: 'API is running'
    });
  });
   


export default router;