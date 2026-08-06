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

// create AccessToken
export function createAccessToken(payload: AccessTokenPayload) {
    return jwt.sign(payload, process.env.ACCESS_KEY!, {
        expiresIn: '15m',
    });
}

// create RefreshToken
export function createRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, process.env.REFRESH_KEY!, {
        expiresIn: '7d',
    });
}

// verify refreshToken
export function verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.REFRESH_KEY!) as RefreshTokenPayload;
}
