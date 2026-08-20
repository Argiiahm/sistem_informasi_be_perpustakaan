import * as UserService from '../services/user.service.js';
import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUserSchema } from '../validations/user.schema.js';

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
