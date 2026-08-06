import { Router } from 'express';
import { Register, Login, Refresh } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/refresh', Refresh);

export default router;
