import type { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema, sellerRegistrationSchema, setUpSellerSchema } from "../validator/auth.validator";
import { AuthError, ValidationError } from "../middlewares/error-handler";
import prisma from "../config/prisma";
import {
  checkOtpRestriction,
  deleteSession,
  getUserFromResetToken,
  getUserFromToken,
  persistSeller,
  persistUser,
  resetPasswordToken,
  sendOtp,
  setSellerToRedis,
  trackOtpRequest,
  verifyOtp,
} from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import {
  clearAuthCookies,
  generateSessionId,
  generateTokens,
  RefreshTokenPayload,
  rotateTokens,
  setAuthCookies,
  verifyRefreshToken,
} from "../utils/token.helper";
import { SellerAccountCreationStatus, sellers, sessions } from "../generated/prisma";
import { _env } from "../config";
import redis from "../config/redis";
import Razorpay from "razorpay";
import { sendEvent } from "../events/producer";
import { SELLER_EVENTS } from "../events/events.constants";

const razorpay = new Razorpay({
  key_id: _env.RAZORPAY_KEY_ID,
  key_secret: _env.RAZORPAY_KEY_SECRET,
});


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
      const user = await getUserFromResetToken(token, next);
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
  async sellerRegistration(req: Request, res: Response, next: NextFunction) {
    const validate = sellerRegistrationSchema.safeParse(req.body);
    if (!validate.success) {
      return next(new ValidationError("Invalid Fields! Seller registration not allowed"));
    }
    const existSeller = await prisma.sellers.findUnique({
      where: {
        email: validate.data?.email
      },
      select: {
        email: true,
      }
    });

    if (existSeller) {
      return next(new ValidationError("Seller already exist"));
    }

    await checkOtpRestriction(validate.data.email, next);
    await trackOtpRequest(validate.data.email, next);
    await sendOtp(
      validate.data.name,
      validate.data.email,
      "seller-activation-mail",
    );
    const { token } = await persistSeller(validate.data);

    if (!token) {
      return next(new ValidationError("Seller registration not allowed"));
    }

    return res.status(200).json({
      message: "OTP sent to your email",
      success: true,
      data: {
        redirect_token: token,
      },
    });
  }

  async verifySeller(req: Request, res: Response, next: NextFunction) {
    const { otp, token } = req.body;
    if (!otp || !token || !otp.trim() || !token.trim()) {
      return next(new ValidationError("Invalid request data"));
    }
    try {
      const user = await getUserFromToken(token, next);
      if (!user || !user.email) {
        return next(new ValidationError("Invalid token"));
      }
      const existSeller = await prisma.sellers.findUnique({
        where: {
          email: user?.email,
        },
      });

      if (existSeller) {
        return next(new ValidationError("Seller already exist"));
      }

      await verifyOtp(user?.email!, token, otp, next);
      const hashedPassword = await bcrypt.hash(user?.password!, 10);

      const seller = await prisma.sellers.create({
        data: {
          name: user?.name!,
          email: user?.email!,
          password: hashedPassword,
          country: user?.country!,
          phone_no: user?.phone_number!,
          stripe_id: "",
          registration_status: SellerAccountCreationStatus.SETUP,
        },
      })



      if (!seller || !seller.id) {
        return next(new ValidationError("Server side error"));
      }

      // Store seller to redis
      await setSellerToRedis(seller);

      const sessionId = await generateSessionId(seller.id, 'SELLER');

      const { accessToken, refreshToken } = await generateTokens({
        sessionId,
        id: seller.id,
        email: seller.email,
        name: seller.name,
        role: "SELLER",
        userType: "SELLER",
      });

      setAuthCookies(res, {
        accessToken,
        refreshToken,
      });

      await sendEvent({
        eventType: SELLER_EVENTS.SELLER_CREATED,
        data: {
          id: seller.id,
          role: "SELLER",
          email: seller.email,
          sessionId: sessionId,
          name: seller.name,
        },
      })

      return res.status(200).json({
        message: "Seller verified successfully",
        success: true,
      });
    } catch (error) {
      console.log(error)
      return next(error);
    }
  }

  async loginSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = loginSchema.safeParse(req.body);
      if (!validate.success) {
        throw new ValidationError(JSON.stringify(validate.error));
      }
      const seller = await prisma.sellers.findUnique({
        where: {
          email: validate.data.email,
        },
      });
      if (!seller) {
        return next(new AuthError("Seller not found"));
      }
      await setSellerToRedis(seller);
      const isPasswordValid = await bcrypt.compare(
        validate.data.password,
        seller.password!,
      );
      if (!isPasswordValid) {
        return next(new AuthError("Invalid credentials"));
      }

      const sessionId = await generateSessionId(seller.id, 'SELLER');

      const { accessToken, refreshToken } = await generateTokens({
        sessionId,
        id: seller.id,
        email: seller.email,
        name: seller.name,
        role: "SELLER",
        userType: "SELLER",
      });

      setAuthCookies(res, {
        accessToken,
        refreshToken,
      });

      return res.status(200).json({
        message: "Login successful",
        success: true,
        data: {
          status: seller.registration_status
        }
      });
    } catch (error) {
      console.log(error)
      return next(error);
    }
  }

  async setupSeller(req: Request, res: Response, next: NextFunction) {
    const seller = req.user?.id;
    const validate = setUpSellerSchema.safeParse(req.body);
    if (!validate.success) {
      return next(new ValidationError(JSON.stringify(validate.error.issues[0].message)));
    }

    try {
      const seller = await prisma.sellers.findUnique({
        where: {
          id: req.user?.id,
        },
      })

      if (!seller) {
        return next(new AuthError("Seller not found"));
      }

      if (seller.registration_status !== SellerAccountCreationStatus.SETUP) {
        return next(new ValidationError("Seller already setup"));
      }

      //  SHOP CREATION
      const shop = await prisma.shops.create({
        data: {
          name: validate.data.businessName,
          bio: validate.data.businessBio,
          category: validate.data.category,
          opening_hours: validate.data.openingHours,
          address: validate.data.address,
          website: validate.data.website || "",
          seller: {
            connect: {
              id: seller.id,
            },
          },
        },
      });

      if (!shop) {
        return next(new ValidationError("Shop creation failed"));
      }
      await prisma.sellers.update({
        where: {
          id: seller.id,
        },
        data: {
          registration_status: SellerAccountCreationStatus.CONNECT,
        },
      })
      return res.status(200).json({
        message: "Seller account setup successfully",
        success: true,
      })
    } catch (error) {
      return next(error);
    }
  }


  async connectRezorpay(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json({
      message: "Rezorpay connected successfully",
      success: true
    })
  }
  async logoutSeller(req: Request, res: Response, next: NextFunction) {
    try {
      if(!req.user){
        return next(new AuthError("Authentication required"));
      }
      await redis.del(`seller:${req.user?.id}`);
      await prisma.sessions.delete({
        where: {
          id: req.user?.sessionId,
        },
      })
      clearAuthCookies(res);
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
