import { Router } from 'express';
import { Register, Login, Refresh, Logout, Me } from '../controllers/auth.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authRateLimit } from '../middlewares/ratelimit.middleware.js';

const router = Router();

router.post('/auth/register', authRateLimit, Register);
router.post('/auth/login', authRateLimit, Login);
router.post('/auth/refresh', Refresh);
router.post('/auth/logout', Logout);

router.get('/me', authentication, Me);

export default router;
