import createHttpError from 'http-errors';
import * as BorrowService from '../services/borrowBook.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import { BorrowBookSchema } from '../validations/borrowBook.schema.js';

export const borrowBook = asyncHandler(async (req: Request, res: Response) => {
    // Get userId from Request user authentication.
    const userId = req.user?.id;
    // Check, is Valid user?
    if (!userId) {
        throw createHttpError.Unauthorized('Unauthorization');
    }
    // Validate with zod
    const validateData = BorrowBookSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    const borrowBook = await BorrowService.BorrowBook({ ...validateData.data }, userId);
    return res.status(201).json({
        success: true,
        message: 'Successfully borrow a book.',
        data: borrowBook,
    });
});
