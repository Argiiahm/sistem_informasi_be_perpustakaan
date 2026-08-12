import { Router } from 'express';
import { Register, Login, Refresh, Logout, Me } from '../controllers/auth.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';

const router = Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refresh', Refresh);
router.post('/logout', Logout);
router.get('/me', authentication, Me);

export default router;
