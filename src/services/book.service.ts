import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { BookInput } from '../validations/book.schema.js';

// get Books
export const getAllBook = async () => {
    return await prisma.book.findMany();
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
