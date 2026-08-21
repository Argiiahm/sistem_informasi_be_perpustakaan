import { Router } from 'express';
import {
    confirmRequestReturnBook,
    getRequestReturnBook,
    myBorrow,
    returnBook,
} from '../controllers/returnBook.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/auhorization.middleware.js';

const router = Router();

// user
router.get('/borrows', authentication, myBorrow);
router.post('/borrow/:borrowId/returned', authentication, returnBook);

// Admin
router.get('/admin/return/book', authentication, authorization('admin'), getRequestReturnBook);
router.post(
    '/admin/return/book/:borrowId/confirm',
    authentication,
    authorization('admin'),
    confirmRequestReturnBook
);

export default router;
