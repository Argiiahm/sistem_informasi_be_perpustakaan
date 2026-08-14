import { prisma } from '../config/prisma.js';
import type { getUserInput } from '../validations/user.schema.js';

// getUser
export const getUsers = async (data: getUserInput) => {
    const { page, limit, search, role, sortBy, sortOrder } = data;
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
                [sortBy]: sortOrder,
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
