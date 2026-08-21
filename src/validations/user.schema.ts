import { z } from 'zod';

const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;

export const UserSchema = z.object({
    fullname: z
        .string()
        .trim()
        .min(3, 'Name Minimum 3 Character')
        .max(55, 'Name Maximum 55 Character'),
    no_telp: z.string().trim().min(1, 'No telp is Required').regex(phoneRegex, {
        message: 'Invalid Indonesia Number. (example: 0821xxx or 622xxxx)',
    }),
    email: z.string().min(1, 'Email is Required').trim().email(),
    password: z.string().min(8, 'Password Minimum 8 Character'),
    role: z.enum(['user', 'admin', 'superadmin']).default('user'),
});

export const getUserSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(5),
    search: z.string().trim().optional(),
    role: z.enum(['user', 'admin', 'superadmin']).optional(),
    sortBy: z.enum(['fullname', 'email', 'createdAt']).default('createdAt'),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
});

export type UserInput = z.infer<typeof UserSchema>;
export type getUserInput = z.infer<typeof getUserSchema>;
