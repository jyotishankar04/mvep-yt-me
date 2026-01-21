import { Request, Response, NextFunction, CookieOptions } from "express";
import AuthService from "../services/auth.service";
import { sellerRegisterSchema } from "../validator";
import {
  UnauthorizedError,
  ValidationError,
} from "../../../middlewares/error-handler";
import OtpService from "../services/otp.service";
import { Seller, SessionStatus, User } from "../../../generated/prisma/client";
import MailService from "../services/mail.service";
import {
  EMAIL_TYPE,
  forgotPasswordEmailTemplate,
  registerEmailTemplate,
} from "../utils/email.html";
import { TOKEN_PURPOSE, TokenPayload } from "../types/token.types";
import { TokenService } from "../services/token.service";
import { cookieTypes, setCookie } from "../utils/cookie";
import { comparePassword, hashPassword } from "../utils/password";
import { SessionService } from "../services/seller.session.service";
import { detectDeviceType, generateDeviceId } from "../utils/device";

class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}
  async registerSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = sellerRegisterSchema.safeParse(req.body);
      if (!validate.success) {
        return next(new ValidationError(validate.error.message));
      }
      const existingSeller = await this.authService.getSellerByEmail(
        validate.data.email,
      );

      if (existingSeller && existingSeller.isVerified) {
        return next(new ValidationError("Email already exists"));
      }

      if (existingSeller && !existingSeller.isApproved) {
        return res.status(403).json({
          success: false,
          message: "Seller not approved",
          data: {
            action: "Please wait for approval",
          },
        });
      }

      // check if user exist but not verified then skip the registration process
      const hashedPassword = await hashPassword(validate.data.password);
      let seller: Seller | undefined;
      if (!existingSeller) {
        seller = await this.authService.register({
          ...validate.data,
          password: hashedPassword,
        });
      } else {
        seller = existingSeller;
      }

      if (!seller) {
        return next(new Error("Seller registration failed"));
      }

      const otp = await this.otpService.generateOtp(seller.email);
      const mailHtml = registerEmailTemplate({
        name: seller.name,
        otp: String(otp),
      });
      await this.mailService.sendEmail(
        seller.email,
        "OTP verification",
        mailHtml,
      );

      const tokenPayload: TokenPayload = {
        sub: seller.id,
        email: seller.email,
        role: "SELLER",
        verified: seller.isVerified,
      };

      const token = this.tokenService.generateToken(
        tokenPayload,
        TOKEN_PURPOSE.REGISTER,
      );

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      setCookie(res, cookieTypes.registrationToken, token, cookieOptions);

      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully", token });
    } catch (error) {
      next(error);
    }
  }
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp } = req.body;
      if (!otp) {
        if (otp.length !== 6) {
          return next(new ValidationError("OTP must be 6 digits"));
        }
        if (!otp) {
          return next(new ValidationError("OTP is required"));
        }
      }
      const token = req.cookies[cookieTypes.registrationToken];
      const decodedToken = this.tokenService.verifyToken(
        token,
        TOKEN_PURPOSE.REGISTER,
      );
      if (!decodedToken) {
        return next(new ValidationError("Invalid token"));
      }
      const seller = await this.authService.getSellerById(decodedToken.sub);

      if (!seller) {
        return next(new ValidationError("Seller not found"));
      }

      const isVerified = await this.otpService.verifyOtp(seller.email, otp);

      if (!isVerified) {
        return next(new ValidationError("Invalid OTP"));
      }

      await this.authService.verifySeller(seller.id);

      return res
        .status(200)
        .json({ success: true, message: "Seller verified successfully" });
    } catch (error) {
      next(error);
    }
  }
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[cookieTypes.registrationToken];
      const decodedToken = this.tokenService.verifyToken(
        token,
        TOKEN_PURPOSE.REGISTER,
      );

      if (!decodedToken) {
        return next(new ValidationError("Invalid token"));
      }
      const seller = await this.authService.getSellerById(decodedToken.sub);

      if (!seller) {
        return next(new ValidationError("Seller not found"));
      }

      const otp = await this.otpService.generateOtp(seller.email);

      const html = registerEmailTemplate({
        name: seller.name,
        otp: String(otp),
      });
      await this.mailService.sendEmail(seller.email, "OTP Verification", html);
      const generatedToken = this.tokenService.generateToken(
        { sub: seller.id },
        TOKEN_PURPOSE.REGISTER,
      );
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      setCookie(
        res,
        cookieTypes.registrationToken,
        generatedToken,
        cookieOptions,
      );

      return res
        .status(200)
        .json({ success: true, message: "OTP sent successfully", token });
    } catch (error) {
      next(error);
    }
  }
  async loginSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const seller = await this.authService.getSellerByEmail(email);

      if (!seller) {
        return next(new ValidationError("Invalid email or password"));
      }
      if (seller && !seller.isVerified) {
        return next(new ValidationError("Please verify your email"));
      }
      if (!seller.isApproved) {
        return res.status(403).json({
          success: false,
          message: "Seller not approved",
          data: {
            action: "Please wait for approval",
          },
        });
      }

      const isPasswordValid = await comparePassword(password, seller.password!);
      if (!isPasswordValid) {
        return next(new ValidationError("Invalid email or password"));
      }

      /* -------------------- 3️⃣ DEVICE FINGERPRINT -------------------- */
      const deviceId = generateDeviceId({
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip,
      });

      /* -------------------- 4️⃣ CREATE SESSION -------------------- */
      const session = await this.sessionService.createSession({
        sellerId: seller.id,
        deviceId,
        deviceType: detectDeviceType(req.headers["user-agent"]),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      /* -------------------- 5️⃣ CREATE TOKENS -------------------- */
      const accessToken = this.tokenService.generateToken(
        {
          sub: seller.id,
          email: seller.email,
          role: "SELLER",
          name: seller.name,
          isVerified: seller.isVerified,
          sessionId: session.id,
          deviceId,
        },
        "access",
      );

      const refreshToken = await this.sessionService.createRefreshToken(
        session.id,
      );

      /* -------------------- 6️⃣ SET REFRESH AND ACCESS COOKIE -------------------- */
      res.cookie("sellerRegisterSchema", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("sellerAccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });
      /* -------------------- 7️⃣ RESPONSE -------------------- */
      return res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return next(error);
    }
  }
  async logoutSeller(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.sellerRegisterSchema;
      if (!refreshToken) {
        return next(new ValidationError("No refresh token provided"));
      }
      const decoded = this.tokenService.verifyToken(
        refreshToken,
        TOKEN_PURPOSE.REFRESH,
      );
      if (!decoded) {
        return next(new ValidationError("Invalid refresh token"));
      }
      const session = await this.sessionService.getSessionById(decoded.session);
      if (!session) {
        return next(new ValidationError("Session not found"));
      }
      await this.sessionService.revokeSession(session.id);
      res.clearCookie("sellerRegisterSchema");
      res.clearCookie("sellerAccessToken");
      return res.status(200).json({
        success: true,
        message: "Seller logged out successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
  async refreshSellerToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.sellerRegisterSchema;

      if (!refreshToken) {
        return next(new ValidationError("No refresh token provided"));
      }

      // Just validate, don't rotate yet
      const session =
        await this.sessionService.getSessionByRefreshToken(refreshToken);

      if (!session || session.status === SessionStatus.REVOKED) {
        return next(new ValidationError("Invalid or expired refresh token"));
      }

      const seller = await this.authService.getSellerById(session.sellerId);
      if (!seller) {
        return next(new ValidationError("User not found"));
      }

      // Generate new access token (this is the main purpose)
      const accessToken = this.tokenService.generateToken(
        {
          sub: seller.id,
          email: seller.email,
          role: "SELLER",
          name: seller.name,
          isVerified: seller.isVerified,
          sessionId: session.id,
        },
        TOKEN_PURPOSE.ACCESS,
      );

      // set COOKIES
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      };

      res.cookie("accessToken", accessToken, cookieOptions);

      // Generate new refresh token
      const sellerRefreshToken = this.tokenService.generateToken(
        {
          sub: seller.id,
          email: seller.email,
          role: "SELLER",
          name: seller.name,
          isVerified: seller.isVerified,
          sessionId: session.id,
        },
        TOKEN_PURPOSE.REFRESH,
      );

      // set COOKIES
      res.cookie("sellerRefreshToken", sellerRefreshToken, cookieOptions);

      res.cookie("sellerAccessToken", accessToken, cookieOptions);

      return res.status(200).json({
        success: true,
        accessToken,
        refreshToken: sellerRefreshToken,
      });
    } catch (error) {
      return next(error);
    }
  }
  // OTP Based Forgot Password
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const seller = await this.authService.getSellerByEmail(email);
      if (!seller) {
        return next(new ValidationError("Seller not found"));
      }

      const otp = await this.otpService.generateOtp(seller.email);
      const mailHtml = forgotPasswordEmailTemplate({
        name: seller.name,
        otp: String(otp),
      });

      await this.mailService.sendEmail(
        seller.email,
        "OTP verification",
        mailHtml,
      );

      const tokenPayload: TokenPayload = {
        sub: seller.id,
        email: seller.email,
        role: "SELLER",
        verified: seller.isVerified,
      };

      const token = this.tokenService.generateToken(
        tokenPayload,
        TOKEN_PURPOSE.FORGOT_PASSWORD,
      );

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };

      setCookie(res, cookieTypes.forgotPasswordToken, token, cookieOptions);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      return next(error);
    }
  }
  async forgotPasswordVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp } = req.body;
      if (!otp) {
        if (otp.length !== 6) {
          return next(new ValidationError("OTP must be 6 digits"));
        }
        if (!otp) {
          return next(new ValidationError("OTP is required"));
        }
      }
      const token = req.cookies[cookieTypes.forgotPasswordToken];
      const decodedToken = this.tokenService.verifyToken(
        token,
        TOKEN_PURPOSE.FORGOT_PASSWORD,
      );
      if (!decodedToken) {
        return next(new ValidationError("Invalid token"));
      }
      const seller = await this.authService.getSellerByEmail(decodedToken.sub);

      if (!seller) {
        return next(new ValidationError("Seller not found"));
      }

      const isVerified = await this.otpService.verifyOtp(seller.email, otp);

      if (!isVerified) {
        return next(new ValidationError("Invalid OTP"));
      }
      const updateUserToken = this.tokenService.generateToken(
        {
          sub: seller.id,
          email: seller.email,
          userId: seller.id,
        },
        TOKEN_PURPOSE.RESET_PASSWORD,
      );
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      setCookie(
        res,
        cookieTypes.resetPasswordToken,
        updateUserToken,
        cookieOptions,
      );

      return res
        .status(200)
        .json({ success: true, message: "Seller verified successfully" });
    } catch (error) {
      return next(error);
    }
  }
  async forgotResetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      if (!password) {
        return next(new ValidationError("Password is required"));
      }
      const token = req.cookies[cookieTypes.forgotPasswordToken];
      const decodedToken = this.tokenService.verifyToken(
        token,
        TOKEN_PURPOSE.FORGOT_PASSWORD,
      );
      if (!decodedToken) {
        return next(new ValidationError("Invalid token"));
      }
      const seller = await this.authService.getSellerById(decodedToken.sub);

      if (!seller) {
        return next(new ValidationError("Seller not found"));
      }

      await this.authService.resetPassword(seller.id, password);

      return res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      return next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return next(new UnauthorizedError("Unauthorized"));
      }
      const { password, oldPassword } = req.body;
      if (
        !password ||
        !oldPassword ||
        !oldPassword.length ||
        !password.length ||
        password.length < 8 ||
        oldPassword.length < 8
      ) {
        return next(
          new ValidationError(
            "Password and old password are required and must be at least 8 characters long",
          ),
        );
      }
      if (password === oldPassword) {
        return next(
          new ValidationError(
            "New password cannot be the same as the old password",
          ),
        );
      }

      const seller = await this.authService.getSellerById(req.user?.id!);

      if (!seller) {
        return next(new ValidationError("Seller not found"));
      }

      await this.authService.resetPassword(seller.id, password);

      return res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      return next(error);
    }
  }

  async validateSession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return next(new UnauthorizedError("Unauthorized"));
      }
      return res.status(200).json({
        success: true,
        message: "Session validated successfully",
        data: {
          user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role,
          },
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthController;
