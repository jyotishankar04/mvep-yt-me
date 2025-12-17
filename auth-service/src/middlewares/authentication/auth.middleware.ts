// middlewares/auth.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken, AccessTokenPayload, verifyRefreshToken, rotateTokens, clearAuthCookies, setAuthCookies } from "../../utils/token.helper";
import prisma from "../../config/prisma";
import redis from "../../config/redis";
import { AuthError } from "../error-handler";
import { users } from "../../generated/prisma";

// Extend Express Request type to include user property
declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload
            }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // 1. Try to get token from Authorization header first
        let accessToken = req.headers.authorization?.replace("Bearer ", "");

        // 2. Fallback to cookie if header is not present
        if (!accessToken && req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        }

        // 3. If no token found
        if (!accessToken) {
            //   try to refresh token
            return next(new AuthError("Authentication required"));
        }


        const decoded = verifyAccessToken(accessToken) as AccessTokenPayload;

        if (!decoded) {
            return next(new AuthError("Invalid access token"));
        }
        console.log(decoded)
        // 6. Validate user still exists in database
        const cachedUser = await redis.get(`user:${decoded.id}`);
        let user: Partial<users> | null = null;
        if (cachedUser) {
            user = JSON.parse(cachedUser);
        } else {
            user = await prisma.users.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    avatar: true,
                    password:false,
                    name: true,
                    following: true,
                }
            });
            if (user) {
                await redis.set(`user:${decoded.id}`, JSON.stringify(user));
            }
        }

        if (!user) {
            return next(new AuthError("User not found"));
        }
        console.log(user)

        // 7. Attach user to request object
        req.user = {
            id: user.id!,
            email: user.email!,
            role: user.role!,
            name: user.name!,
            sessionId: decoded.sessionId || "" // Optional: Store sessionId if available in token
        };

        next();

    } catch (error) {
        return next(error);
    }
};


// Optional: Soft authentication (user is optional)
export const authenticateOptional = async (
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
            const decoded = verifyAccessToken(accessToken) as AccessTokenPayload;
            const user = await prisma.users.findUnique({
                where: { id: decoded.id },
                select: { id: true, email: true, role: true, name: true }
            });
            
            if (user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    sessionId: decoded.sessionId || "",
                    name: user.name
                };
            }

            next();
        } catch (error) {
            // If token is invalid or expired, just continue without user
            next();
        }
    } catch (error) {
        next();
    }
};