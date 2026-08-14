import { Router } from 'express';
import { Register, Login, Refresh, Logout, Me } from '../controllers/auth.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';

const router = Router();

router.post('/auth/register', Register);
router.post('/auth/login', Login);
router.post('/auth/refresh', Refresh);
router.post('/auth/logout', Logout);

router.get('/me', authentication, Me);

export default router;
