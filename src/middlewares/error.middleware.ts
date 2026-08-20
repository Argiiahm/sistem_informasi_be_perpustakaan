import type { Request, Response, NextFunction } from 'express';
import { isHttpError } from 'http-errors';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (isHttpError(err)) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
}
