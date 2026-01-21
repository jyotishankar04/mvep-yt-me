import { NextFunction, Request, Response } from "express";
import { _env } from "../../../config/env";
import jwt from "jsonwebtoken";
class AuthController {
  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;
      if (!username || !username.trim() || !password || !password.trim()) {
        return next(new Error("Invalid username or password"));
      }
      let isValid = false;
      if (
        username === _env.ADMIN_USERNAME &&
        password === _env.ADMIN_PASSWORD
      ) {
        isValid = true;
      }
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }
      const accessToken = jwt.sign(
        {
          id: "1",
          username: _env.ADMIN_USERNAME,
          email: "admin@qwikish.com",
          role: "ADMIN",
        },
        _env.JWT_ACCESS_SECRET,
        {
          expiresIn: "1h",
        },
      );
      const refreshToken = jwt.sign(
        {
          id: "1",
          username: _env.ADMIN_USERNAME,
          email: "admin@qwikish.com",
          role: "ADMIN",
        },
        _env.JWT_REFRESH_SECRET,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("adminRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("adminAccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
      });

      const response = {
        success: true,
        message: "Admin verified successfully",
        data: {
          accessToken,
          refreshToken,
        },
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }
  async logoutAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken || !refreshToken.trim()) {
        return next(new Error("Invalid refresh token"));
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
      if (!decoded) {
        return next(new Error("Invalid refresh token"));
      }
      const response = {
        success: true,
        message: "Admin logged out successfully",
      };
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken || !refreshToken.trim()) {
        return next(new Error("Invalid refresh token"));
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
      if (!decoded) {
        return next(new Error("Invalid refresh token"));
      }
      const accessToken = jwt.sign(
        {
          id: "1",
          username: _env.ADMIN_USERNAME,
          email: "admin@qwikish.com",
          role: "AMD",
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        },
      );
      const response = {
        success: true,
        message: "Admin token refreshed successfully",
        data: {
          accessToken,
        },
      };
      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default AuthController;
