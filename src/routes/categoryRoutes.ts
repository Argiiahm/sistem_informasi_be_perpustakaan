import { Router } from 'express';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from '../controllers/category.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/auhorization.middleware.js';

const router = Router();

router.get('/categories', authentication, getCategories);
router.get('/category/:id', authentication, getCategory);
router.post('/category', authentication, authorization('admin', 'superadmin'), createCategory);
router.put('/category/:id', authentication, authorization('admin', 'superadmin'), updateCategory);
router.delete(
    '/category/:id',
    authentication,
    authorization('admin', 'superadmin'),
    deleteCategory
);

export default router;
