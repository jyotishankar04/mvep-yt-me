import type { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validator/auth.validator";
import { AuthError, ValidationError } from "../middlewares/error-handler";
import prisma from "../config/prisma";
import {
  checkOtpRestriction,
  deleteSession,
  getUserFromResetToken,
  getUserFromToken,
  persistUser,
  resetPasswordToken,
  sendOtp,
  trackOtpRequest,
  verifyOtp,
} from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import {
  generateSessionId,
  generateTokens,
  RefreshTokenPayload,
  rotateTokens,
  setAuthCookies,
  verifyRefreshToken,
} from "../utils/token.helper";
import { sessions } from "../generated/prisma";

class AuthController {
  async userRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = registerSchema.safeParse(req.body);
      if (!validate.success) {
        throw new ValidationError(JSON.stringify(validate.error));
      }
      const existUser = await prisma.users.findUnique({
        where: {
          email: validate.data.email,
        },
      });
      if (existUser) {
        return next(new ValidationError("User already exist"));
      }

      // OTP Restriction
      await checkOtpRestriction(validate.data.email, next);

      // track the otp request
      await trackOtpRequest(validate.data.email, next);
      await sendOtp(
        validate.data.name,
        validate.data.email,
        "user-activation-mail",
      );
      const { token } = await persistUser(validate.data);
      return res.status(200).json({
        message: "OTP sent to your email",
        success: true,
        data: {
          redirect_token: token,
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, token } = req.body;
      if (!otp || !token || !otp.trim() || !token.trim()) {
        return next(new ValidationError("Invalid request data"));
      }
      const user = await getUserFromToken(token, next);
      const existUser = await prisma.users.findUnique({
        where: {
          email: user?.email,
        },
      });

      if (existUser) {
        return next(new ValidationError("User already exist"));
      }

      await verifyOtp(user?.email!, token, otp, next);
      const hashedPassword = await bcrypt.hash(user?.password!, 10);
      await prisma.users.create({
        data: {
          name: user?.name!,
          email: user?.email!,
          password: hashedPassword,
          role: user?.role || "USER",
        },
      });
      return res.status(200).json({
        message: "User verified successfully",
        success: true,
      });
    } catch (error) {
      return next(error);
    }
  }
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = loginSchema.safeParse(req.body);
      if (!validate.success) {
        throw new ValidationError(JSON.stringify(validate.error));
      }
      const user = await prisma.users.findUnique({
        where: {
          email: validate.data.email,
        },
      });
      if (!user) {
        return next(new AuthError("User not found"));
      }
      const isPasswordValid = await bcrypt.compare(
        validate.data.password,
        user.password!,
      );
      if (!isPasswordValid) {
        return next(new AuthError("Invalid credentials"));
      }

      const sessionId = await generateSessionId(user.id);

      const { accessToken, refreshToken } = await generateTokens({
        id: user.id,
        role: user.role,
        email: user.email,
        sessionId,
        name: user.name,
      });

      setAuthCookies(res, {
        accessToken,
        refreshToken,
      });

      return res.status(200).json({
        message: "Login successful",
        success: true,
      });
    } catch (error) {
      return next(error);
    }
  }
  async forgotUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email || !email.trim()) {
        return next(new ValidationError("Invalid request data"));
      }
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return next(new AuthError("User not found"));
      }
      // OTP Restriction
      await checkOtpRestriction(user.email!, next);
      await trackOtpRequest(user.email!, next);
      const { token: redirectToken } = await persistUser({
        name: user.name!,
        email: user.email!,
        password: user.password!,
        role: user.role,
      });

      // Send OTP
      await sendOtp(user.name!, user.email!, "forgot-password-user-mail");
      return res.status(200).json({
        message: "OTP sent to your email",
        success: true,
        data: {
          redirect_token: redirectToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
  async verifyForgotPasswordOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { otp, token } = req.body;
      if (!otp || !token || !otp.trim() || !token.trim()) {
        return next(new ValidationError("Invalid request data"));
      }
      const user = await getUserFromToken(token, next);
      if (!user) {
        return next(new ValidationError("Invalid token"));
      }
      await verifyOtp(user.email!, token, otp, next);
      // allow user to reset password before 5 minutes
      const resetAllowToken = await resetPasswordToken(user.email!);
      return res.status(200).json({
        message: "OTP verified successfully",
        success: true,
        data: {
          redirect_token: resetAllowToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async resetUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPassword, token } = req.body;
      if (!newPassword || !token || !newPassword.trim() || !token.trim()) {
        return next(new ValidationError("Invalid request data"));
      }
      console.log(token);
      const user = await getUserFromResetToken(token, next);
      console.log(user);
      if (!user) {
        return next(new ValidationError("Invalid token"));
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.users.update({
        where: {
          email: user.email,
        },
        data: {
          password: hashedPassword,
        },
      });
      return res.status(200).json({
        message: "Password reset successfully",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  async checkSession(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        message: "Session valid",
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return next(new AuthError("Authentication required"));
      }
      const { accessToken, refreshToken: newRefreshToken } =
        await rotateTokens(refreshToken);
      setAuthCookies(res, {
        accessToken,
        refreshToken: newRefreshToken,
      });
      return res.status(200).json({
        message: "Token refreshed successfully",
        success: true,
      });
    } catch (error) {
      return next(error);
    }
  }
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user) {
      return next(new AuthError("Authentication required"));
    }
    const sessionId = user.sessionId;
    if (!sessionId) {
      return next(new AuthError("Session not found"));
    }
    deleteSession(req.cookies.accessToken, sessionId);
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res.status(200).json({
        message: "Logout successful",
        success: true,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;
