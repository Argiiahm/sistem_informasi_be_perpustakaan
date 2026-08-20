import { Router } from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/auhorization.middleware.js';
import { getUsers } from '../controllers/user.controller.js';

const router = Router();

router.get('/users', authentication, authorization('admin', 'superadmin'), getUsers);

export default router;
