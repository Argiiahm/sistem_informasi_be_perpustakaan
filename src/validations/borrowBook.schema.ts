import { z } from 'zod';

export const BorrowBookSchema = z.object({
    bookId: z.string().min(1, 'BookId Required.'),
    dueDate: z.coerce.date(),
    status: z.enum(['pending', 'accepted', 'rejected', 'returned']).default('pending'),
});

export type BorrowBookInput = z.infer<typeof BorrowBookSchema>;
