import { Router } from 'express';
import {
    confirmRequestReturnBook,
    getRequestReturnBook,
    myBorrow,
    returnBook,
} from '../controllers/returnBook.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';

const router = Router();

// user
router.get('/borrows', authentication, myBorrow);
router.post('/borrow/:borrowId/returned', authentication, returnBook);

// Admin
router.get('/admin/return/book', authentication, getRequestReturnBook);
router.post('/admin/return/book/:borrowId/confirm', authentication, confirmRequestReturnBook);

export default router;
