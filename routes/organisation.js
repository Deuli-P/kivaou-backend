import { Router } from 'express';
import { createOrganization } from '../controllers/organization.js';
const organisationRouter = Router();


organisationRouter.get('/:id', );
organisationRouter.put('/edit', );
organisationRouter.post('/create', createOrganization);
organisationRouter.delete('/delete', );
organisationRouter.get('/personnal', );


export default organisationRouter;