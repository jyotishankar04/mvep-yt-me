import { Request, Response, NextFunction } from "express";
import AuthController from "../controllers/auth.controller";
import jwt from "jsonwebtoken";
import { _env } from "../../../config/env";

const authController = new AuthController();

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.adminAccessToken;
    const refreshToken = req.cookies.adminRefreshToken;
    if (!token || !refreshToken) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, _env.JWT_ACCESS_SECRET) as { id: string };
    const admin = jwt.verify(refreshToken, _env.JWT_REFRESH_SECRET) as {
      id: string;
      role: "ADMIN";
      name: string;
      email: string;
    };
    req.user = {
      id: admin.id,
      role: "ADMIN",
      name: admin.name,
      email: admin.email,
      deviceId: "",
      isVerified: true,
      sessionId: "",
    };
    next();
  } catch (error) {
    next(error);
  }
};
