import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type {
    AcceptBorrowInput,
    BorrowBookInput,
    GetBorrowInput,
} from '../validations/borrowBook.schema.js';

// Get All BorrowBook For Admin
export const getAllBorrow = async (data: GetBorrowInput) => {
    const { page, limit, search, status, sortBy, orderBy } = data;
    const skip = (page - 1) * limit;

    const where = {
        ...(search
            ? {
                  OR: [
                      {
                          user: {
                              OR: [
                                  {
                                      fullname: {
                                          contains: search,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                                  {
                                      email: {
                                          contains: search,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                              ],
                          },
                      },
                      {
                          book: {
                              OR: [
                                  {
                                      bookCode: {
                                          contains: search,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                                  {
                                      title: {
                                          contains: search,
                                          mode: 'insensitive' as const,
                                      },
                                  },
                              ],
                          },
                      },
                  ],
              }
            : {}),

        ...(status
            ? {
                  status,
              }
            : {}),
    };

    const [borrows, count] = await Promise.all([
        prisma.borrowBook.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: orderBy,
            },
            select: {
                id: true,
                bookId: true,
                userId: true,
                loanDate: true,
                dueDate: true,
                status: true,
                user: {
                    select: {
                        fullname: true,
                        email: true,
                    },
                },
                book: {
                    select: {
                        bookCode: true,
                        title: true,
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.borrowBook.count({ where }),
    ]);

    return {
        items: borrows,
        pagination: {
            page,
            limit,
            count,
            countPages: Math.ceil(count / limit),
            hasNextPage: page < Math.ceil(count / limit),
            hasPreviousPage: page > 1,
        },
    };
};

// BorrowBook
export const borrowBook = async (data: BorrowBookInput, userId: string) => {
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
export const acceptBorrowBook = async (borowId: string, data: AcceptBorrowInput) => {
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

        // Update
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

// Reject BorrowBook
export const rejectBorrowBook = async (borowId: string) => {
    const borowBook = await prisma.borrowBook.findFirst({
        where: { id: borowId },
    });

    if (!borowBook) {
        throw createHttpError.NotFound('BorrowBook Not Found');
    }

    if (borowBook.status !== 'pending') {
        throw createHttpError.BadRequest('Only Supported Status Pending.');
    }

    // Find Book
    const book = await prisma.book.findFirst({
        where: { id: borowBook.bookId },
    });

    // check if bookId is Invalid
    if (!book) {
        throw createHttpError.NotFound('Book Not Found.');
    }

    // Update Status Borrow
    const result = await prisma.borrowBook.update({
        where: { id: borowBook.id },
        data: {
            status: 'rejected',
        },
    });

    return result;
};
