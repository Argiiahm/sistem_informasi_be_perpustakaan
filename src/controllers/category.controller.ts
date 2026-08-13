import * as CategoryService from '../services/category.service.js';
import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CategorySchema, type CategoryInput } from '../validations/category.schema.js';

// get Categories
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.getCategories();
    return res.status(200).json({
        success: true,
        data: category,
    });
});

// get Category ByID
export const getCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const category = await CategoryService.getCategory(req.params.id);
    return res.status(200).json({
        success: true,
        data: category,
    });
});

// create Category
export const createCategory = asyncHandler(
    async (req: Request<object, object, CategoryInput>, res: Response) => {
        // validate with zod
        const validateData = CategorySchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        // create Category
        const category = await CategoryService.createCategory({ ...validateData.data });
        return res.status(201).json({
            success: true,
            message: 'Category successfully created.',
            data: category,
        });
    }
);

// update Category
export const updateCategory = asyncHandler(
    async (req: Request<{ id: string }, object, CategoryInput>, res: Response) => {
        // validate with zod
        const validateData = CategorySchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        // update Category
        const category = await CategoryService.updateCategory(req.params.id, {
            ...validateData.data,
        });

        return res.status(200).json({
            success: true,
            message: 'Category successfully updated.',
            data: category,
        });
    }
);

// delete Category
export const deleteCategory = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await CategoryService.deleteCategory(req.params.id);
    return res.status(200).json({
        success: true,
        message: 'Category successfully deleted.',
    });
});
