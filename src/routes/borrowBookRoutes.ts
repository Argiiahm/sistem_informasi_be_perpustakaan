import { Router } from 'express';
import { borrowBook } from '../controllers/borrowBook.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';

const router = Router();

router.post('/borrow/book', authentication, borrowBook);

export default router;
