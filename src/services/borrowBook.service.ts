import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { AcceptBorrowInput, BorrowBookInput } from '../validations/borrowBook.schema.js';

// BorrowBook
export const BorrowBook = async (data: BorrowBookInput, userId: string) => {
    const book = await prisma.book.findFirst({
        where: { id: data.bookId },
    });

    // check if bookId is Invalid
    if (!book) {
        throw createHttpError.NotFound('Book Not Found.');
    }

    // Check if stock book is zero.
    if (book.stockBuku <= 0) {
        throw createHttpError.BadRequest('BookStock is Empty.');
    }

    // Create a new BorrowBook
    const borrowBook = prisma.borrowBook.create({
        data: {
            bookId: book.id,
            userId: userId,
            loanDate: new Date(),
            status: 'pending',
        },
    });

    return borrowBook;
};

// Accept BorrowBook
export const AcceptBorrowBook = async (borowId: string, data: AcceptBorrowInput) => {
    // FIX THIS FOR TOMOROW!
    // IF USER IS LOGOUT OR NOT AUTHENTICATION
    // WHY RETURN BOOK IS VALID?

    const borrowBook = await prisma.borrowBook.findFirst({
        where: { id: borowId },
    });

    if (!borrowBook) {
        throw createHttpError.NotFound('BorrowBook Not Found.');
    }

    if (borrowBook.status !== 'pending') {
        throw createHttpError.BadRequest('Only Supported Status Pending.');
    }

    const result = await prisma.$transaction(async (tx) => {
        // find Book
        const book = await tx.book.findFirst({
            where: { id: borrowBook.bookId },
        });

        // check if bookId is Invalid
        if (!book) {
            throw createHttpError.NotFound('Book Not Found.');
        }

        // Check if stock book is zero.
        if (book.stockBuku <= 0) {
            throw createHttpError.BadRequest('BookStock is Empty.');
        }

        // Decrement Stock Book
        await tx.book.update({
            where: { id: borrowBook.bookId },
            data: {
                stockBuku: { decrement: 1 },
            },
        });

        const updatedBorrowBook = await tx.borrowBook.update({
            where: { id: borowId },
            data: {
                dueDate: new Date(data.dueDate),
                status: 'accepted',
            },
        });

        return updatedBorrowBook;
    });

    return result;
};
