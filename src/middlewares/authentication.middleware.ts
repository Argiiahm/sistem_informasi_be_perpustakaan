import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    try {
        const AuthHeader = req.headers.authorization;
        if (!AuthHeader || !AuthHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorization',
            });
        }

        const token = AuthHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorization',
            });
        }

        req.user = verifyAccessToken(token);
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid Token',
        });
    }
};
