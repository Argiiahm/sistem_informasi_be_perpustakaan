import * as AuthService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { Request, Response } from 'express';
import {
    AuthSchemaLogin,
    AuthSchemaRegister,
    type AuthInputLogin,
    type AuthInputRegister,
} from '../validations/auth.schema.js';
import { refreshCookieOptions } from '../constants/cookie.js';

// Register
export const Register = asyncHandler(
    async (req: Request<object, object, AuthInputRegister>, res: Response) => {
        // validate with zod
        const validateData = AuthSchemaRegister.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const user = await AuthService.Register(validateData.data);
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });
    }
);

// Login
export const Login = asyncHandler(
    async (req: Request<object, object, AuthInputLogin>, res: Response) => {
        // validate with zod
        const validateData = AuthSchemaLogin.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        const result = await AuthService.Login(validateData.data);
        res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            data: {
                accessToken: result.accessToken,
            },
        });
    }
);

// Refresh
export const Refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await AuthService.Refresh(refreshToken);
    return res.status(200).json({
        success: true,
        data: {
            accessToken: result.accessToken,
        },
    });
});

// Logout
export const Logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    await AuthService.Logout(refreshToken);

    // clear Cookie
    res.clearCookie('refreshToken', refreshCookieOptions);

    return res.status(200).json({
        success: true,
        message: 'Logout successfully.',
    });
});

// Me
export const Me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorization',
        });
    }

    const user = await AuthService.Me(req.user.id);
    return res.status(200).json({
        success: true,
        data: user,
    });
});
