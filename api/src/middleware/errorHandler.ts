<<<<<<< HEAD
import { Request, Response, NextFunction } from "express";
import { HttpException } from './error/utils.js';

export const errorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    res.json({
        status,
        message: err.message
    });
=======
import { Request, Response, NextFunction } from "express";
import { HttpException } from './error/utils.js';

export const errorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    const status = err.status || 500;
    res.json({
        status,
        message: err.message
    });
>>>>>>> 55a0c20f9fe2d1abaa7ec3c0e7733d9f16c87924
};