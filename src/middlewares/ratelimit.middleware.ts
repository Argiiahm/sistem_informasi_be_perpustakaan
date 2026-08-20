import rateLimit from 'express-rate-limit';

export const apiRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // 15menit
    limit: 100, // maxsimal 100 Request per IP,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // Jadi satu IP maksimal 100 request setiap 10 menit.
    message: {
        success: false,
        message: 'Terlalu banyak percobaan, coba lagi nanti.',
    },
});

export const authRateLimit = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // Jadi satu IP maksimal 5 request setiap 10 menit.
    message: {
        success: false,
        message: 'Terlalu banyak percobaan, coba lagi nanti.',
    },
});
