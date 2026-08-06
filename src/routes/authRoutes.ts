import { Router } from 'express';
import { Register, Login, Refresh, Logout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refresh', Refresh);
router.post('/logout', Logout);

export default router;
