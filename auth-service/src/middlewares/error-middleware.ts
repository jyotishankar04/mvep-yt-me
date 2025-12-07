import type { NextFunction, Request, Response } from "express";
import { AppError } from "./error-handler";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof AppError){
        console.log(`Error ${req.method} ${req.url} :: ${err.message} `);
    }

    return res.status(err instanceof AppError ? err.statusCode: 500).json({
        message: err.message || "Something went wrong",
        success: false,
        ...(err instanceof AppError && { details: err.details })
    });
};