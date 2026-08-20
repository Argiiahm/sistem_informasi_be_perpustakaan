import { z } from 'zod';

// BookSchema
export const BookSchema = z.object({
    bookCode: z.string().min(1, 'bookCode Required.'),
    title: z.string().min(1, 'title Required').max(200, 'title maximum 200 character'),
    author: z.string().min(1, 'author Required'),
    publicationYear: z.coerce.date(),
    stockBuku: z.number(),
    synopsis: z.string().min(1, 'synopsis Required'),
    coverBook: z.string().optional(),
    categoryId: z.string().min(1, 'CategoryId Required'),
});

// GetBookSchema
export const getBookSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(5),
    search: z.string().trim().optional(),
    categoryId: z.string().trim().optional(),
    sortBy: z.enum(['bookCode', 'title', 'author', 'createdAt']).default('createdAt'),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
});

// Book Input
export type BookInput = z.infer<typeof BookSchema>;
// getBookInput
export type getBookInput = z.infer<typeof getBookSchema>;
