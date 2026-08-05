import type { RequestHandler } from 'express';

export const asyncHandler = <params, resBody, reqBody, reqQuery>(
    fn: RequestHandler<params, resBody, reqBody, reqQuery>
): RequestHandler<params, resBody, reqBody, reqQuery> => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
