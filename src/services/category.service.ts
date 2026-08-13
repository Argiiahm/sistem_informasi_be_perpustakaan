import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { CategoryInput } from '../validations/category.schema.js';

// get Categories
export const getCategories = async () => {
    return await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
    });
};

// get Category byId
export const getCategory = async (id: string) => {
    const category = await prisma.category.findFirst({
        where: { id },
        include: { books: true },
    });

    if (!category) {
        throw createHttpError.NotFound('Category Not Found');
    }

    return category;
};

// create Category
export const createCategory = async (data: CategoryInput) => {
    const existName = await prisma.category.findUnique({ where: { name: data.name } });
    if (existName) {
        throw createHttpError.Conflict('CategoryName already exists.');
    }

    return await prisma.category.create({
        data: { ...data },
        select: {
            id: true,
            name: true,
        },
    });
};

// update Category
export const updateCategory = async (id: string, data: CategoryInput) => {
    const category = await prisma.category.findFirst({
        where: { id },
    });

    if (!category) {
        throw createHttpError.NotFound('Category Not Found');
    }

    // check duplicate name
    const existName = await prisma.category.findFirst({
        where: { name: data.name, id: { not: id } },
    });

    if (existName) {
        throw createHttpError.Conflict('CategoryName already exists.');
    }

    return await prisma.category.update({
        where: { id },
        data: { ...data },
    });
};

// delete Category
export const deleteCategory = async (id: string) => {
    const category = await prisma.category.findFirst({
        where: { id },
    });

    if (!category) {
        throw createHttpError.NotFound('Category Not Found');
    }

    return await prisma.category.delete({
        where: { id },
    });
};
