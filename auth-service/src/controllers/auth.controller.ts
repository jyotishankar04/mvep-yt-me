import { Request, Response, NextFunction, CookieOptions } from "express";
import AuthService from "../services/auth.service";
import { userRegisterSchema } from "../validator";
import { ValidationError } from "../middlewares/error-handler";
import OtpService from "../services/otp.service";
import MailService from "../services/mail.service";
import { EMAIL_TYPE, getTemplate } from "../utils/email.html";
import { DeviceType, User } from "../generated/prisma";
import { TOKEN_PURPOSE, TokenPayload } from "../types/token.types";
import { TokenService } from "../services/token.service";
import { cookieTypes, setCookie } from "../utils/cookie";
import { comparePassword, hashPassword } from "../utils/password";
import { SessionService } from "../services/session.service";
import { detectDeviceType, generateDeviceId } from "../utils/device";

class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const validate = userRegisterSchema.safeParse(req.body);
      if (!validate.success) {
        return next(new ValidationError(validate.error.message));
      }
      const existingUser = await this.authService.getUserByEmail(
        validate.data.email,
      );

      if (existingUser && existingUser.isVerified) {
        return next(new ValidationError("Email already exists"));
      }

      // check if user exist but not verified then skip the registration process
      const hashedPassword = await hashPassword(validate.data.password);
      let user: User | undefined;
      if (!existingUser) {
        user = await this.authService.register({
          ...validate.data,
          password: hashedPassword,
        });
      } else {
        user = existingUser;
      }

      if (!user) {
        return next(new Error("User registration failed"));
      }

      const otp = await this.otpService.generateOtp(user.email);
      const mailHtml = getTemplate({
        type: EMAIL_TYPE.REGISTER,
        name: user.name,
        otp: String(otp),
      });
      await this.mailService.sendEmail(
        user.email,
        "OTP verification",
        mailHtml,
      );

      const tokenPayload: TokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        verified: user.isVerified,
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
      const user = await this.authService.getUserById(decodedToken.sub);

      if (!user) {
        return next(new ValidationError("User not found"));
      }

      const isVerified = await this.otpService.verifyOtp(user.email, otp);

      if (!isVerified) {
        return next(new ValidationError("Invalid OTP"));
      }

      await this.authService.verifyUser(user.id);

      return res
        .status(200)
        .json({ success: true, message: "User verified successfully" });
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
      const user = await this.authService.getUserById(decodedToken.sub);

      if (!user) {
        return next(new ValidationError("User not found"));
      }

      const otp = await this.otpService.generateOtp(user.email);

      const html = getTemplate({
        name: user.name,
        otp: String(otp),
        type: TOKEN_PURPOSE.REGISTER,
      });
      await this.mailService.sendEmail(user.email, "OTP Verification", html);
      const generatedToken = this.tokenService.generateToken(
        { sub: user.id },
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
  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.authService.getUserByEmail(email);

      if (!user) {
        return next(new ValidationError("Invalid email or password"));
      }
      if (user && !user.isVerified) {
        return next(new ValidationError("Please verify your email"));
      }

      console.log(user);
      const isPasswordValid = await comparePassword(password, user.password!);
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
        userId: user.id,
        deviceId,
        deviceType: detectDeviceType(req.headers["user-agent"]),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      /* -------------------- 5️⃣ CREATE TOKENS -------------------- */
      const accessToken = this.tokenService.generateToken(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          isVerified: user.isVerified,
          sessionId: session.id,
          deviceId,
        },
        "access",
      );

      const refreshToken = await this.sessionService.createRefreshToken(
        session.id,
      );

      /* -------------------- 6️⃣ SET REFRESH COOKIE -------------------- */
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      /* -------------------- 7️⃣ RESPONSE -------------------- */
      return res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
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
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      return res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
