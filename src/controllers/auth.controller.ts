import * as AuthService from '../services/auth.service.js';
import { asyncHandler } from '../validations/asyncHandler.js';
import type { Request, Response } from 'express';
import { AuthSchema, type AuthInput } from '../validations/auth.schema.js';

// Register
export const Register = asyncHandler(
    async (req: Request<object, object, AuthInput>, res: Response) => {
        // validate with zod
        const validateData = AuthSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const user = await AuthService.Register({
            ...validateData.data,
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });
    }
);
