import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Role } from '../generated/prisma/client.js';

export const authorization =
    (...roles: Role[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user?.role) {
            return next(createHttpError.Unauthorized('Unauthorized'));
        }

        if (!roles.includes(req.user.role)) {
            return next(createHttpError.Forbidden('Access denied.'));
        }

        return next();
    };
