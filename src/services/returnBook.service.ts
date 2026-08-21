import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { GetReturnBookInput } from '../validations/returnBookSchema.js';

// myBorrow
export const myBorrow = async (userId: string) => {
    return await prisma.borrowBook.findMany({
        where: { userId },
        select: {
            id: true,
            loanDate: true,
            dueDate: true,
            status: true,
            user: {
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                },
            },
            book: {
                select: {
                    id: true,
                    bookCode: true,
                    title: true,
                    author: true,
                    coverBook: true,
                },
            },
        },
    });
};

// Return Book
export const returnBook = async (borrowId: string, userId: string) => {
    // set Harga Denda telat /hari
    const dailyFineAmount = 2000;

    // inisialisai awal
    // variable simpan adaDenda? dan Total Denda yang didapat
    let isDueDate;
    let fineAmount = 0;

    // Find BorrowBook ById
    const borrowBook = await prisma.borrowBook.findFirst({
        where: { id: borrowId, userId: userId, status: 'accepted' },
    });

    // Cek Apakah BorrowBook ini ada atau valid?
    if (!borrowBook) {
        throw createHttpError.NotFound('Invalid BorrowId.');
    }

    // cek apakah statusnya sudah di acc?
    if (borrowBook.status !== 'accepted') {
        throw createHttpError.BadRequest('Only Supported Status Accepted.');
    }

    // cek apakah buku sudah Request untuk mengembalikan Buku?
    const existRequestReturn = await prisma.returnBook.findFirst({
        where: { borrowId: borrowId },
    });

    if (existRequestReturn) {
        throw createHttpError.Conflict('please waiting admin for confirm.');
    }

    // cek apakah user ini telat dalam mengembalikan buku?
    if (borrowBook.dueDate! < new Date()) {
        isDueDate = true;
        // Hitung selisih dalam milidetik
        const diffTime = Math.abs(new Date().getTime() - borrowBook.dueDate!.getTime());
        // Bagi dengan jumlah milidetik dalam satu hari, lalu bulatkan ke atas
        const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Hitung total denda yang didapat
        fineAmount = dailyFineAmount * duration;
    }

    // update status ReturnBook
    await prisma.returnBook.create({
        data: {
            borrowId: borrowBook.id,
            fineAmount: fineAmount,
            status: isDueDate ? 'duedate' : 'ontime',
            returnDate: new Date(),
        },
    });
};

// get All Request ReturnBook
export const getRequestReturnBook = async (data: GetReturnBookInput) => {
    const { page, limit, search, status, sortBy, orderBy } = data;
    const skip = (page - 1) * limit;

    const where = {
        ...(search
            ? {
                  borrow: {
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
              }
            : {}),

        ...(status ? { status } : {}),
    };

    const [returnBook, count] = await Promise.all([
        prisma.returnBook.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: orderBy,
            },
            select: {
                id: true,
                borrowId: true,
                fineAmount: true,
                returnDate: true,
                status: true,
                borrow: {
                    select: {
                        loanDate: true,
                        dueDate: true,
                        status: true,
                        user: {
                            select: {
                                fullname: true,
                            },
                        },
                        book: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        }),

        prisma.returnBook.count({ where }),
    ]);

    return {
        returnBook,
        count,
    };
};

// confirm Request Return
export const confirmRequestReturnBook = async (borrowId: string) => {
    const borrow = await prisma.borrowBook.findFirst({
        where: { id: borrowId },
        include: { returnBooks: true },
    });

    if (!borrow || !borrow.returnBooks) {
        throw createHttpError.NotFound('Invalid Request Returned.');
    }

    if (borrow.status !== 'accepted') {
        throw createHttpError.NotFound('Only Supported status Accepted.');
    }

    // Transaction for Update Status Borrow And Update StockBook
    const result = await prisma.$transaction(async (tx) => {
        // update status borrowBook to 'Returned.'
        await tx.borrowBook.update({
            where: { id: borrow.id },
            data: {
                status: 'returned',
            },
        });

        // update stockBook
        await tx.book.update({
            where: { id: borrow.bookId },
            data: {
                stockBuku: { increment: 1 },
            },
        });
    });

    return result;
};
