import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { BookInput, getBookInput } from '../validations/book.schema.js';

// get Books
export const getAllBook = async (data: getBookInput) => {
    const { page, limit, search, categoryId, sortBy, orderBy } = data;
    const skip = (page - 1) * limit;

    const where = {
        ...(search
            ? {
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
                      {
                          title: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          author: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : {}),

        ...(categoryId
            ? {
                  categoryId,
              }
            : {}),
    };

    const [books, count] = await Promise.all([
        prisma.book.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: orderBy,
            },
            select: {
                id: true,
                bookCode: true,
                title: true,
                author: true,
                publicationYear: true,
                stockBuku: true,
                synopsis: true,
                coverBook: true,
                createdAt: true,

                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),

        prisma.book.count({ where }),
    ]);

    return {
        data: books,
        pagination: {
            page,
            limit,
            count,
            countPage: Math.ceil(count / limit),
            hasNextPage: page < Math.ceil(count / limit),
            hasPreviousPage: page > 1,
        },
    };
};

// get Book byID
export const getBook = async (id: string) => {
    const book = await prisma.book.findFirst({ where: { id } });
    if (!book) {
        throw createHttpError.NotFound('Book not found');
    }

    return book;
};

// create Book
export const createBook = async (data: BookInput) => {
    const [existBookCode, category] = await Promise.all([
        prisma.book.findUnique({ where: { bookCode: data.bookCode } }),
        prisma.category.findFirst({ where: { id: data.categoryId } }),
    ]);

    if (existBookCode) {
        throw createHttpError.Conflict('BookCode Already Exist.');
    }

    if (!category) {
        throw createHttpError.NotFound('Category Not Found.');
    }

    return await prisma.book.create({
        data: {
            bookCode: data.bookCode,
            title: data.title,
            author: data.author,
            publicationYear: data.publicationYear,
            stockBuku: data.stockBuku,
            synopsis: data.synopsis,
            coverBook: data.coverBook ?? null,
            categoryId: data.categoryId,
        },
    });
};

// update Book
export const updateBook = async (id: string, data: BookInput) => {
    const [book, existBookCode, category] = await Promise.all([
        prisma.book.findFirst({ where: { id } }),
        prisma.book.findFirst({ where: { bookCode: data.bookCode, id: { not: id } } }),
        prisma.category.findFirst({ where: { id: data.categoryId } }),
    ]);

    if (!book) {
        throw createHttpError.NotFound('Book Not Found');
    }

    if (existBookCode) {
        throw createHttpError.Conflict('BookCode Already Exist.');
    }

    if (!category) {
        throw createHttpError.NotFound('Category Not Found.');
    }

    return await prisma.book.update({
        where: { id },
        data: {
            ...data,
            coverBook: data.coverBook ?? null,
        },
    });
};

// delete Book
export const deleteBook = async (id: string) => {
    const book = await prisma.book.findFirst({ where: { id } });
    if (!book) {
        throw createHttpError.NotFound('Book not found');
    }

    await prisma.book.delete({ where: { id } });
};
