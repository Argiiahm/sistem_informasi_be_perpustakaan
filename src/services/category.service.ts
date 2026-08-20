import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import { type CategoryInput, type GetCategoryInput } from '../validations/category.schema.js';

// get Categories
export const getCategories = async (data: GetCategoryInput) => {
    const { page, limit, search, sortBy, orderBy } = data;
    const skip = (page - 1) * limit;

    const where = {
        ...(search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : {}),
    };

    const [categories, count] = await Promise.all([
        prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: orderBy,
            },
            select: {
                id: true,
                name: true,
            },
        }),

        // total categories
        prisma.category.count({ where }),
    ]);

    return {
        items: categories,
        pagination: {
            page,
            limit,
            count,
            countPages: Math.ceil(page / limit),
            hasNextPage: page < Math.ceil(page / limit),
            hasPreviousPage: page > 1,
        },
    };
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
