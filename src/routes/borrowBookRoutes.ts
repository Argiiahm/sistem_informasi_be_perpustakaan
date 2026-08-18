import { Router } from 'express';
import {
    acceptBorrowBook,
    borrowBook,
    rejectBorrowBook,
} from '../controllers/borrowBook.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/auhorization.middleware.js';

const router = Router();

router.post('/borrow/book', authentication, borrowBook);
// Default, role Admin as Manage this EndPoint.
// Accept
router.put(
    '/borrow/book/:borrowId/accepted',
    authentication,
    authorization('admin'),
    acceptBorrowBook
);
// Reject
router.put(
    '/borrow/book/:borrowId/rejected',
    authentication,
    authorization('admin'),
    rejectBorrowBook
);

export default router;
