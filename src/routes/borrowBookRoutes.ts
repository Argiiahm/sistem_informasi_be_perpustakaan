import { Router } from 'express';
import { AcceptBorrowBook, borrowBook } from '../controllers/borrowBook.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';

const router = Router();

router.post('/borrow/book', authentication, borrowBook);

// Default, role Admin as Manage this EndPoint.
router.put('/borrow/book/:borrowId', authentication, AcceptBorrowBook);

export default router;
