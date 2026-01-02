import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { userRegisterSchema } from "../validator";
import { ValidationError } from "../middlewares/error-handler";
import OtpService from "../services/otp.service";
import MailService from "../services/mail.service";
import { EMAIL_TYPE, getTemplate } from "../utils/email.html";
import { User } from "../generated/prisma";

class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}
  async registerUser(req: Request, res: Response, next: NextFunction) {
    //         Client
    //   ↓
    // POST /api/auth/register
    //   ↓
    // Validate input
    //   ↓
    // Check user exists
    //   ↓
    // Create user (unverified)
    //   ↓
    // Generate OTP
    //   ↓
    // Store OTP in Redis (TTL)
    //   ↓
    // Send OTP (email)
    //   ↓
    // Response: "OTP sent"

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

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
