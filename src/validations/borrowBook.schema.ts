import { z } from 'zod';

export const BorrowBookSchema = z.object({
    bookId: z.string().min(1, 'BookId Required.'),
    status: z.enum(['pending', 'accepted', 'rejected', 'returned']).default('pending'),
});

export const AcceptBarrowSchmea = z.object({
    dueDate: z.coerce.date(),
});

export type BorrowBookInput = z.infer<typeof BorrowBookSchema>;
export type AcceptBarrowSchmea = z.infer<typeof AcceptBarrowSchmea>;
