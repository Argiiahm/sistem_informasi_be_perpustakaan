import { z } from 'zod';

// CategorySchema
export const CategorySchema = z.object({
    name: z
        .string()
        .min(1, 'CategoryName Required')
        .max(200, 'CategoryName maximum 200 character.'),
});

// GetCategorySchema
export const GetCategorySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
export type GetCategoryInput = z.infer<typeof GetCategorySchema>;
