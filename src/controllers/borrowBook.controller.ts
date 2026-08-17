import * as borrowBookService from '../services/borrowBook.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import { borrowBookSchema } from '../validations/borrowBook.schema.js';
import createHttpError from 'http-errors';

export const borrowBook = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw createHttpError.Unauthorized('Unauthorized');
    }

    const validatedData = borrowBookSchema.safeParse(req.body);
    if (!validatedData.success) {
        return res.status(400).json({
            success: false,
            errors: validatedData.error.flatten(),
        });
    }

    const result = await borrowBookService.borrowBook(userId, { ...validatedData.data });
    return res.status(201).json({
        success: true,
        message: 'Successfully borrowBook',
        data: result,
    });
});
