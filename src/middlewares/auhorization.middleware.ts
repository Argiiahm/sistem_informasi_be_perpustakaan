import type { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { Role } from '../generated/prisma/client.js';

export const authorization =
    (...roles: Role[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role!)) {
            next(createHttpError.Forbidden('Access Denied.'));
        }

        next();
    };
