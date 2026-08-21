import { Router } from 'express';
import {
    createBook,
    deleteBook,
    getAllBook,
    getBook,
    updateBook,
} from '../controllers/book.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/auhorization.middleware.js';

const router = Router();

router.get('/books', getAllBook);
router.get('/book/:id', getBook);

// CRUD BOOK
router.post('/book', authentication, authorization('admin', 'superadmin'), createBook);
router.put('/book/:id', authentication, authorization('admin', 'superadmin'), updateBook);
router.delete('/book/:id', authentication, authorization('admin', 'superadmin'), deleteBook);

export default router;
