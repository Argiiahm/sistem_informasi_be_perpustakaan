import { z } from 'zod';

export const GetReturnBookSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(5),
    search: z.string().trim().optional(),
    status: z.enum(['ontime', 'duedate']).optional(),
    sortBy: z.enum(['returnDate']).default('returnDate'),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
});

export type GetReturnBookInput = z.infer<typeof GetReturnBookSchema>;
