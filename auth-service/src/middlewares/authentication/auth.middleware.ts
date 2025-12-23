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
    let accessToken = req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken && req.cookies?.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      return next(new AuthError("Authentication required"));
    }

    const decoded = verifyAccessToken(accessToken) as AccessTokenPayload;

    if (!decoded) {
      return next(new AuthError("Invalid access token"));
    }

    // Check if it's a SELLER token
    if (decoded.role === "SELLER") {
      // Check Redis cache for seller
      const cachedSeller = await redis.get(`seller:${decoded.id}`);
      let seller: any = null;
      
      if (cachedSeller) {
        seller = JSON.parse(cachedSeller);
      } else {
        seller = await prisma.sellers.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            name: true,
            registration_status: true,
            phone_no: true,
            country: true,
            stripe_id: true,
          }
        });
        
        if (seller) {
          await redis.setex(
            `seller:${decoded.id}`,
            3600, // 1 hour
            JSON.stringify(seller)
          );
        }
      }

      if (!seller) {
        return next(new AuthError("Seller not found"));
      }

      req.user = {
        id: seller.id,
        email: seller.email,
        role: "SELLER",
        name: seller.name,
        sessionId: decoded.sessionId || ""
      };

      next();
    } else {
      // Original USER authentication logic
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
            password: false,
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

      req.user = {
        id: user.id!,
        email: user.email!,
        role: user.role!,
        name: user.name!,
        sessionId: decoded.sessionId || ""
      };

      next();
    }
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
            console.log(decoded)
            if(decoded.role === "SELLER"){
                const seller = await prisma.sellers.findUnique({
                    where: { id: decoded.id },
                    select: { id: true, email: true, name: true }
                })
                if (seller) {
                    req.user = {
                        id: seller.id,
                        email: seller.email,
                        role: "SELLER",
                        sessionId: decoded.sessionId || "",
                        name: seller.name
                    };
                    return next();
                }
            }else if (decoded.role === "USER") {
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
        }
        } catch (error) {
            // If token is invalid or expired, just continue without user
            next();
        }
    } catch (error) {
        next();
    }
};