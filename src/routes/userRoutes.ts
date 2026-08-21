import { Router } from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/auhorization.middleware.js';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/user.controller.js';

const router = Router();

router.get('/superadmin/users', authentication, authorization('superadmin'), getUsers);
router.post('/superadmin/user', authentication, authorization('superadmin'), createUser);
router.put('/superadmin/user/:userId', authentication, authorization('superadmin'), updateUser);
router.delete('/superadmin/user/:userId', authentication, authorization('superadmin'), deleteUser);

export default router;
