import jwt from 'jsonwebtoken';
import { Role } from '../generated/prisma/client.js';

export interface AccessTokenPayload {
    id: string;
    email: string;
    role: Role;
}

interface RefreshTokenPayload {
    id: string;
    tokenId: string;
}

export function createAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, process.env.ACCESS_KEY!, {
        expiresIn: '15m',
    });
}

export function createRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, process.env.REFRESH_KEY!, {
        expiresIn: '7d',
    });
}
