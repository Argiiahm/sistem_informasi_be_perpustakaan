import { prisma } from '../config/prisma.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import type { AuthInput } from '../validations/auth.schema.js';

// Register
export const Register = async (data: AuthInput) => {
    const [existEmail, existTelp] = await Promise.all([
        prisma.user.findUnique({ where: { email: data.email } }),
        prisma.user.findUnique({ where: { no_telp: data.no_telp } }),
    ]);

    if (existEmail) {
        throw createHttpError(409, 'Email Already Registered.');
    }

    if (existTelp) {
        throw createHttpError(409, 'No Telp Already Registered.');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            fullname: data.fullname,
            no_telp: data.no_telp,
            email: data.email,
            password: hashPassword,
        },
        select: {
            id: true,
            fullname: true,
            no_telp: true,
            email: true,
            role: true,
            created_at: true,
        },
    });

    return user;
};
