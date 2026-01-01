// middlewares/auth.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, type AccessTokenPayload } from "../../utils/jwt";

// Optional: Soft authentication (user is optional)
// Minimal version for services without database access
export const authenticate= async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let accessToken = req.headers.authorization?.replace("Bearer ", "");

        if (!accessToken && req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        }

        if (!accessToken) {
            return next(); // No user attached, continue
        }

        try {
            const decoded = verifyAccessToken(accessToken);
            // Attach decoded token payload directly without database lookup
            req.user = decoded;
            next();
        } catch (error) {
            // If token is invalid or expired, just continue without user
            next();
        }
    } catch (error) {
        next();
    }
};