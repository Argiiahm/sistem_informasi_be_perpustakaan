import createHttpError from 'http-errors';
import * as BorrowService from '../services/borrowBook.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import { AcceptBarrowSchmea, BorrowBookSchema } from '../validations/borrowBook.schema.js';

// BorrowBook
export const borrowBook = asyncHandler(async (req: Request, res: Response) => {
    // Get userId from Request user authentication.
    if (!req.user || !req.user.id) {
        throw createHttpError.Unauthorized('Unauthorization');
    }
    const userId = req.user.id;

    // Validate with zod
    const validateData = BorrowBookSchema.safeParse(req.body);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    // create
    const borrowBook = await BorrowService.borrowBook({ ...validateData.data }, userId);
    return res.status(201).json({
        success: true,
        message: 'Successfully borrow a book.',
        data: borrowBook,
    });
});

// Accept Borrow
export const acceptBorrowBook = asyncHandler(
    async (req: Request<{ borrowId: string }>, res: Response) => {
        const borrowId = req.params.borrowId;
        if (!borrowId) {
            throw createHttpError.BadRequest('BorrowId is required.');
        }

        // validate with zod
        const validateData = AcceptBarrowSchmea.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        // update
        const result = await BorrowService.acceptBorrowBook(borrowId, validateData.data);
        return res.status(200).json({
            success: true,
            message: 'BorrowBook Successfully Accepted.',
            data: result,
        });
    }
);

// Reject Borrow
export const rejectBorrowBook = asyncHandler(
    async (req: Request<{ borrowId: string }>, res: Response) => {
        const borowId = req.params.borrowId;
        if (!borowId) {
            throw createHttpError.BadRequest('BorrowId is required.');
        }

        const result = await BorrowService.rejectBorrowBook(borowId);
        return res.status(200).json({
            success: true,
            message: 'BorrowBook Successfully Rejected.',
            data: result,
        });
    }
);
