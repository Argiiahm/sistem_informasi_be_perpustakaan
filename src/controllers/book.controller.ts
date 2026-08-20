import * as BookService from '../services/book.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import { BookSchema, getBookSchema } from '../validations/book.schema.js';

// get Books
export const getAllBook = asyncHandler(async (req: Request, res: Response) => {
    // validate
    const validateData = getBookSchema.safeParse(req.query);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }
    const result = await BookService.getAllBook(validateData.data);
    return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
    });
});

// get Book ByID
export const getBook = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const book = await BookService.getBook(req.params.id);
    return res.status(200).json({
        success: true,
        data: book,
    });
});

// create Book
export const createBook = asyncHandler(async (req: Request, res: Response) => {
    // validate with zod
    const validateData = BookSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    // create Book
    const book = await BookService.createBook({ ...validateData.data });
    return res.status(201).json({
        success: true,
        message: 'Book successfully created.',
        data: book,
    });
});

// Update Book
export const updateBook = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    // validate with zod
    const validateData = BookSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    // updated Book
    const book = await BookService.updateBook(req.params.id, { ...validateData.data });
    return res.status(200).json({
        success: true,
        message: 'Book successfully updated.',
        data: book,
    });
});

// Delete Book
export const deleteBook = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await BookService.deleteBook(req.params.id);
    return res.status(200).json({
        success: true,
        message: 'Book successfully deleted.',
    });
});
