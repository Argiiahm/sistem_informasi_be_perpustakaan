import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { BorrowBookInput } from '../validations/borrowBook.schema.js';

// BorrowBook
export const BorrowBook = async (data: BorrowBookInput, userId: string) => {
    const book = await prisma.book.findFirst({
        where: { id: data.bookId },
    });

    // check if bookId is Invalid
    if (!book) {
        throw createHttpError.NotFound('Book Not Founds.');
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
            dueDate: new Date(data.dueDate),
            status: 'pending',
        },
    });

    return borrowBook;
};
