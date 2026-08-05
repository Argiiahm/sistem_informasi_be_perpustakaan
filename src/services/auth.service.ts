import { prisma } from '../config/prisma.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import type { AuthInputLogin, AuthInputRegister } from '../validations/auth.schema.js';
import { createAccessToken, createRefreshToken } from '../utils/jwt.js';
import { randomUUID } from 'crypto';

// Register
export const Register = async (data: AuthInputRegister) => {
    // check already email and telp.
    const [existEmail, existTelp] = await Promise.all([
        prisma.user.findUnique({ where: { email: data.email } }),
        prisma.user.findUnique({ where: { no_telp: data.no_telp } }),
    ]);

    if (existEmail) {
        throw createHttpError.Conflict('Email Already Registered.');
    }

    if (existTelp) {
        throw createHttpError.Conflict('No Telp Already Registered.');
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

// Login
export const Login = async (data: AuthInputLogin) => {
    // check valid user
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
        throw createHttpError.Unauthorized('Invalid Credentials');
    }

    // check valid password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
        throw createHttpError.Unauthorized('Invalid Credentials');
    }

    // generate tokenId
    const tokenId = randomUUID();

    // Create AccessToken
    const accessToken = createAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    // create RefreshToken
    const refreshToken = createRefreshToken({
        id: user.id,
        tokenId: tokenId,
    });

    // hash RefreshToken
    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
    // Save session
    await prisma.refreshToken.create({
        data: {
            id: tokenId,
            userId: user.id,
            tokenHash: hashRefreshToken,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
    });

    return {
        accessToken,
        refreshToken,
    };
};
