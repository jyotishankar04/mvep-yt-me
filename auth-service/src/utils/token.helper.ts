import jwt from "jsonwebtoken";
import { _env } from "../config";
import { Response } from "express";
import prisma from "../config/prisma";
import redis from "../config/redis";
import { sessions, users } from "../generated/prisma";
import { AuthError, ValidationError } from "../middlewares/error-handler";

// Token interfaces for better type safety
export interface AccessTokenPayload {
  id: string;
  role: string;
  email: string;
  sessionId: string;
  name: string;
  iat?: number;
  exp?: number;
  userType?: "USER" | "SELLER";
}

export interface RefreshTokenPayload {
  sessionId: string;
  iat?: number;
  exp?: number;
}

// Constants for better maintainability
const TOKEN_EXPIRY = {
  ACCESS: "15m",
  REFRESH: "7d",
} as const;

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const REDIS_KEYS = {
  session: (sessionId: string) => `session:${sessionId}`,
  user: (userId: string) => `user:${userId}`,
} as const;

export const generateAccessToken = (data: AccessTokenPayload): string => {
  return jwt.sign(data, _env.JWT_ACCESS_SECRET, {
    expiresIn: TOKEN_EXPIRY.ACCESS,
  });
};

export const generateRefreshToken = (sessionId: string): string => {
  return jwt.sign({ sessionId }, _env.JWT_REFRESH_SECRET, {
    expiresIn: TOKEN_EXPIRY.REFRESH,
  });
};

export interface GenerateTokensData {
  id: string;
  role: string;
  email: string;
  name: string;
  sessionId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}


// Update generateTokens to include userType
export const generateTokens = async (
  data: GenerateTokensData & { userType?: 'USER' | 'SELLER' },
): Promise<TokenPair> => ({
  accessToken: generateAccessToken({
    ...data,
    userType: data.userType || 'USER',
  }),
  refreshToken: generateRefreshToken(data.sessionId),
});

// Update rotateTokens to handle both USER and SELLER
export const rotateTokens = async (
  refreshToken: string,
): Promise<TokenPair> => {
  let sessionId: string;

  try {
    const payload = verifyRefreshToken(refreshToken);
    sessionId = payload.sessionId;
  } catch (error) {
    throw new AuthError("Invalid refresh token");
  }

  if (!sessionId) {
    throw new AuthError("Missing session ID in refresh token");
  }

  const sessionKey = REDIS_KEYS.session(sessionId);
  let sessionData: sessions | null = null;

  try {
    const cachedSession = await redis.get(sessionKey);
    if (cachedSession) {
      sessionData = JSON.parse(cachedSession);
    }
  } catch (error) {
    console.warn("Failed to parse cached session data:", error);
  }

  if (!sessionData) {
    try {
      sessionData = await prisma.sessions.findUnique({
        where: { id: sessionId },
      });

      if (sessionData) {
        await redis.setex(
          sessionKey,
          7 * 24 * 60 * 60,
          JSON.stringify(sessionData),
        );
      }
    } catch (error) {
      throw new AuthError("Failed to fetch session data");
    }
  }

  if (!sessionData) {
    throw new AuthError("Session not found");
  }

  // Determine if it's a USER or SELLER session
  const isSellerSession = sessionData.seller_id !== null;
  
  if (isSellerSession) {
    // Handle SELLER
    const sellerKey = `seller:${sessionData.seller_id}`;
    let sellerData: any = null;

    try {
      const cachedSeller = await redis.get(sellerKey);
      if (cachedSeller) {
        sellerData = JSON.parse(cachedSeller);
      }
    } catch (error) {
      console.warn("Failed to parse cached seller data:", error);
    }

    if (!sellerData) {
      sellerData = await prisma.sellers.findUnique({
        where: { id: sessionData.seller_id! },
        select: {
          id: true,
          email: true,
          name: true,
          registration_status: true,
          // Add other necessary fields
        },
      });

      if (sellerData) {
        await redis.setex(
          sellerKey,
          1 * 60 * 60, // 1 hour
          JSON.stringify(sellerData),
        );
      }
    }

    return {
      accessToken: generateAccessToken({
        id: sellerData?.id!,
        role: "SELLER",
        email: sellerData?.email!,
        sessionId,
        name: sellerData?.name!,
        userType: 'SELLER',
      }),
      refreshToken: generateRefreshToken(sessionId),
    };
  } else {
    // Handle USER (existing logic)
    const userKey = REDIS_KEYS.user(sessionData.user_id!);
    let userData: Partial<users> | null = null;

    try {
      const cachedUser = await redis.get(userKey);
      if (cachedUser) {
        userData = JSON.parse(cachedUser) as Partial<users>;
      }
    } catch (error) {
      console.warn("Failed to parse cached user data:", error);
    }

    if (!userData) {
      userData = await prisma.users.findUnique({
        where: { id: sessionData.user_id! },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
        },
      });

      if (userData) {
        await redis.setex(
          userKey,
          1 * 60 * 60,
          JSON.stringify(userData),
        );
      }
    }

    return {
      accessToken: generateAccessToken({
        id: userData?.id!,
        role: userData?.role || "USER",
        email: userData?.email!,
        sessionId,
        name: userData?.name!,
        userType: 'USER',
      }),
      refreshToken: generateRefreshToken(sessionId),
    };
  }
};


export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, _env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError("Access token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError("Invalid access token");
    }
    throw new AuthError("Failed to verify access token");
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, _env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError("Refresh token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError("Invalid refresh token");
    }
    throw new AuthError("Failed to verify refresh token");
  }
};



// Add this to auth.helper.ts or create a new helper file
export const getUserTypeFromToken = (accessToken: string): 'USER' | 'SELLER' | null => {
  try {
    const decoded = jwt.decode(accessToken) as AccessTokenPayload;
    if (decoded?.role === "SELLER") {
      return 'SELLER';
    } else if (decoded?.role) {
      return 'USER';
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const generateSessionId = async (userId: string,type?:'USER' | 'SELLER'): Promise<string> => {
  if(type === 'SELLER'){
    const session = await prisma.sessions.create({
      data: {
        seller_id: userId,
      },
    });
    await redis.setex(
      REDIS_KEYS.session(session.id),
      7 * 24 * 60 * 60,
      JSON.stringify(session),
    );
    return session.id
  }
  const session = await prisma.sessions.create({
    data: {
      user_id: userId,
    },
  });
  await redis.setex(
    REDIS_KEYS.session(session.id),
    7 * 24 * 60 * 60,
    JSON.stringify(session),
  );
  return session.id;
};

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options?: Partial<typeof COOKIE_OPTIONS>,
): void => {
  res.cookie(name, value, {
    ...COOKIE_OPTIONS,
    ...options,
  });
};

export const clearCookie = (
  res: Response,
  name: string,
  options?: Partial<typeof COOKIE_OPTIONS>,
): void => {
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    ...options,
  });
};

// Helper function to clear all auth cookies
export const clearAuthCookies = (res: Response): void => {
  clearCookie(res, "accessToken");
  clearCookie(res, "refreshToken");
  // Add other auth cookies if you have them
};

// Helper function to set auth cookies
export const setAuthCookies = (res: Response, tokens: TokenPair): void => {
  setCookie(res, "accessToken", tokens.accessToken, {
    maxAge: 15 * 60 * 1000, // 15 minutes for access token
  });
  setCookie(res, "refreshToken", tokens.refreshToken);
};
