import { z } from 'zod';

const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;

export const AuthSchema = z.object({
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
});

export type AuthInput = z.infer<typeof AuthSchema>;
