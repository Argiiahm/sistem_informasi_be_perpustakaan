import { z } from 'zod';

export const getUserSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(5),
    search: z.string().trim().optional(),
    role: z.enum(['user', 'admin', 'superadmin']).optional(),
    sortBy: z.enum(['fullname', 'email', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type getUserInput = z.infer<typeof getUserSchema>;
