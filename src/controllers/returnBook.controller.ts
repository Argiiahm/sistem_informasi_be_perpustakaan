import createHttpError from 'http-errors';
import * as ReturnService from '../services/returnBook.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import { GetReturnBookSchema } from '../validations/returnBookSchema.js';

// My Borrow
export const myBorrow = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
        throw createHttpError.Unauthorized('Unauthorization');
    }
    const userId = req.user.id;
    const myBorrow = await ReturnService.myBorrow(userId);
    return res.status(200).json({
        success: true,
        data: myBorrow,
    });
});

// Return Book
export const returnBook = asyncHandler(
    async (req: Request<{ borrowId: string }>, res: Response) => {
        // Request Params, BorrowId
        const borrowId = req.params.borrowId;
        if (!borrowId) {
            throw createHttpError.BadRequest('BorrowId Required.');
        }

        // Get Request User.
        if (!req.user || !req.user.id) {
            throw createHttpError.Unauthorized('Unauthorization');
        }
        const userId = req.user.id;

        // attach
        const result = await ReturnService.returnBook(borrowId, userId);
        return res.status(200).json({
            success: true,
            message: 'Successfully returned a book, please waiting admin for confirm.',
            data: result,
        });
    }
);

// get All Request ReturnBook
export const getRequestReturnBook = asyncHandler(async (req: Request, res: Response) => {
    const validateData = GetReturnBookSchema.safeParse(req.query);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    const result = await ReturnService.getRequestReturnBook(validateData.data);
    console.log(result);
    return res.status(200).json({
        success: true,
        data: result,
    });
});

// Confirm Request Return
export const confirmRequestReturnBook = asyncHandler(
    async (req: Request<{ borrowId: string }>, res: Response) => {
        const borrowId = req.params.borrowId;
        if (!borrowId) {
            throw createHttpError.BadRequest('BorrowId Required.');
        }
        const result = await ReturnService.confirmRequestReturnBook(borrowId);
        return res.status(200).json({
            success: true,
            message: 'Successfully Confirm Returned a Book',
            data: result,
        });
    }
);
