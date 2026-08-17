import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { borrowBookInput } from '../validations/borrowBook.schema.js';

// borrowBook
export const borrowBook = async (userId: string, data: borrowBookInput) => {
    const [user, book] = await Promise.all([
        prisma.user.findFirst({ where: { id: userId } }),
        prisma.book.findFirst({ where: { id: data.bookId } }),
    ]);

    if (!user) {
        throw createHttpError.NotFound('User Not Found');
    }

    if (!book) {
        throw createHttpError.NotFound('Book Not Found');
    }

    if (book.stockBuku <= 0) {
        throw createHttpError.BadRequest('Book Stock is Empty');
    }

    // Create New BorrowBook
    const borrow = await prisma.borrowBook.create({
        data: {
            bookId: book.id,
            userId: user.id,
            loanDate: new Date(),
            dueDate: new Date(data.dueDate),
            status: 'pending',
        },
    });

    return borrow;
};
