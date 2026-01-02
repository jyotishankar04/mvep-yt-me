import { Request, Response, NextFunction, CookieOptions } from "express";
import AuthService from "../services/auth.service";
import { userRegisterSchema } from "../validator";
import { ValidationError } from "../middlewares/error-handler";
import OtpService from "../services/otp.service";
import MailService from "../services/mail.service";
import { EMAIL_TYPE, getTemplate } from "../utils/email.html";
import { User } from "../generated/prisma";
import { TOKEN_PURPOSE, TokenPayload } from "../types/token.types";
import { TokenService } from "../services/token.service";
import { cookieTypes, setCookie } from "../utils/cookie";

class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
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
      let user: User | undefined;
      if (!existingUser) {
        user = await this.authService.register(validate.data);
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
}

export default AuthController;
