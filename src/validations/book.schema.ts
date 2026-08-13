import { z } from 'zod';

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

export type BookInput = z.infer<typeof BookSchema>;
