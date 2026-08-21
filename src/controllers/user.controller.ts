import * as UserService from '../services/user.service.js';
import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUserSchema, UserSchema, type UserInput } from '../validations/user.schema.js';
import createHttpError from 'http-errors';

// Get All User
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    // validate with zod
    const validateData = getUserSchema.safeParse(req.query);
    if (!validateData.success) {
        return res.status(400).json({
            success: false,
            errors: validateData.error.flatten(),
        });
    }

    // get users
    const result = await UserService.getUsers(validateData.data);
    return res.status(200).json({
        success: true,
        data: result.items,
        pagination: result.pagination,
    });
});

// Create New User
export const createUser = asyncHandler(
    async (req: Request<object, object, UserInput>, res: Response) => {
        // Validate with zod
        const validateData = UserSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        // Create New User
        const user = await UserService.createUser({ ...validateData.data });
        return res.status(201).json({
            success: true,
            message: 'Successfully create new user.',
            data: user,
        });
    }
);

// Update User
export const updateUser = asyncHandler(
    async (req: Request<{ userId: string }, object, UserInput>, res: Response) => {
        const userId = req.params.userId;
        if (!userId) {
            throw createHttpError.BadRequest('userId Required.');
        }
        const validateData = UserSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({
                success: false,
                errors: validateData.error.flatten(),
            });
        }

        // Update user.
        const user = await UserService.updateUser(userId, { ...validateData.data });
        return res.status(200).json({
            success: true,
            message: 'Successfully update user.',
            data: user,
        });
    }
);

// Delete User
export const deleteUser = asyncHandler(async (req: Request<{ userId: string }>, res: Response) => {
    const userId = req.params.userId;
    if (!userId) {
        throw createHttpError.BadRequest('userId Required.');
    }

    // Delete User
    await UserService.deleteUser(userId);
    return res.status(200).json({
        success: true,
        message: 'Successfully Deleted user',
    });
});
