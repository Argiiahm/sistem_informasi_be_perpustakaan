import createHttpError from 'http-errors';
import { prisma } from '../config/prisma.js';
import type { getUserInput, UserInput } from '../validations/user.schema.js';
import bcrypt from 'bcrypt';

// getUser
export const getUsers = async (data: getUserInput) => {
    const { page, limit, search, role, sortBy, orderBy } = data;
    // skip digunakan untuk pagination
    // Atau Artinya menentukan Halaman.
    // contoh:
    // page = 1  limit = 10 (DATA YANG DIAMBIL PERHALAMAN)
    // Maka:
    // (1 - 1) * 10 = 0
    // Artinya tidak melewati data apapun
    // Berarti Jika Page = 2, hasilnya akan (2 - 1) * 10 = 10
    // Yang berarti melewati 10 data sebelumnya.
    const skip = (page - 1) * limit;

    // Data mana yang boleh diambil
    const where = {
        ...(search
            ? {
                  OR: [
                      {
                          fullname: {
                              // contains artinya nilai ini mengandung teks tersebut.
                              // contoh :
                              // fullname = "Argi Ahmes"
                              // search   = "argi"
                              contains: search,
                              // insensitive Ini membuat pencarian tidak peduli huruf besar/kecil.
                              mode: 'insensitive' as const,
                              //  as const membuat TypeScript mempertahankan literal "insensitive".
                              //  kadang menganggap string "insensitive" hanya sebagai string,
                              //  sedangkan Prisma mengharapkan nilai literal tertentu.
                          },
                      },
                      {
                          email: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          no_telp: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : {}),
        ...(role
            ? {
                  role,
              }
            : {}),
    };

    const [users, count] = await Promise.all([
        // get users
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: orderBy,
            },
            select: {
                id: true,
                fullname: true,
                no_telp: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        }),

        // total data users
        prisma.user.count({ where }),
    ]);

    return {
        items: users,
        pagination: {
            page,
            limit,
            count,
            countPages: Math.ceil(count / limit),
            hasNextPage: page < Math.ceil(count / limit),
            hasPreviousPage: page > 1,
        },
    };
};

// Create User
export const createUser = async (data: UserInput) => {
    const [existEmail, existTelp] = await Promise.all([
        prisma.user.findUnique({ where: { email: data.email } }),
        prisma.user.findUnique({ where: { no_telp: data.no_telp } }),
    ]);

    if (existEmail) {
        throw createHttpError.Conflict('Email Already Registered.');
    }

    if (existTelp) {
        throw createHttpError.Conflict('No Telp Already Registered.');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
        data: {
            fullname: data.fullname,
            email: data.email,
            no_telp: data.no_telp,
            password: hashPassword,
            role: data.role,
        },
    });

    return user;
};

// Update User
export const updateUser = async (userId: string, data: UserInput) => {
    const [user, alreadyEmail, alreadyNoTelp] = await Promise.all([
        prisma.user.findFirst({ where: { id: userId } }),
        prisma.user.findFirst({ where: { email: data.email, id: { not: userId } } }),
        prisma.user.findFirst({ where: { no_telp: data.no_telp, id: { not: userId } } }),
    ]);

    if (!user) {
        throw createHttpError.NotFound('User Not Found');
    }

    if (alreadyEmail) {
        throw createHttpError.Conflict('Email Already Registered.');
    }

    if (alreadyNoTelp) {
        throw createHttpError.Conflict('No Telp Already Registered.');
    }

    const hashPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.update({
        where: { id: user.id },
        data: {
            fullname: data.fullname,
            email: data.email,
            no_telp: data.no_telp,
            password: hashPassword,
            role: data.role,
        },
    });
};

// Delete user
export const deleteUser = async (userId: string) => {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
        throw createHttpError.NotFound('User Not Found');
    }

    // Delete user
    return await prisma.user.delete({
        where: { id: user.id },
    });
};
