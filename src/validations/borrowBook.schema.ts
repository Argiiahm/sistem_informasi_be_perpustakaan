import { z } from 'zod';

export const BorrowBookSchema = z.object({
    bookId: z.string().min(1, 'BookId Required.'),
    status: z.enum(['pending', 'accepted', 'rejected', 'returned']).default('pending'),
});

export const GetBorrowBook = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(5),
    search: z.string().trim().optional(),
    status: z.enum(['pending', 'accepted', 'rejected', 'returned']).optional(),
    sortBy: z.enum(['loanDate']).default('loanDate'),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
});

export const AcceptBorrowSchmea = z.object({
    dueDate: z.coerce.date(),
});

export type GetBorrowInput = z.infer<typeof GetBorrowBook>;
export type BorrowBookInput = z.infer<typeof BorrowBookSchema>;
export type AcceptBorrowInput = z.infer<typeof AcceptBorrowSchmea>;
