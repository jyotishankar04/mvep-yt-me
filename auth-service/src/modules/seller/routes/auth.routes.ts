// src/modules/auth/auth.routes.ts
import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import prisma from "../../../config/prismaclient.config";
import OtpService from "../services/otp.service";
import RedisService from "../services/redis.service";
import MailService from "../services/mail.service";
import transporter from "../../../config/mail.config";
import AuthService from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { SessionService } from "../services/seller.session.service";

const router = Router();

// instantiate controller (simple DI for now)
const authService = new AuthService(prisma);
const redisService = new RedisService();
const otpService = new OtpService(redisService);
const mailService = new MailService(transporter);
const tokenService = new TokenService();
const sessionService = new SessionService(prisma);

const authController = new AuthController(
  authService,
  otpService,
  mailService,
  tokenService,
  sessionService,
);

/**
 * --------------------
 * Auth routes
 * --------------------
 */

// Register user (send OTP)
router.post("/register", authController.registerSeller.bind(authController));

// Verify OTP
router.post("/verify", authController.verifyOtp.bind(authController));

// Resend OTP
router.post("/resend", authController.resendOtp.bind(authController));

// Login user (generate token)
router.post("/login", authController.loginSeller.bind(authController));

// Logout user (invalidate token)
router.post("/logout", authController.logoutSeller.bind(authController));

// Refresh token
router.post("/refresh", authController.refreshSellerToken.bind(authController));

// for got password
router.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController),
);
// for verify forgot password
router.post(
  "/verify-forgot-password",
  authController.forgotPasswordVerify.bind(authController),
);

router.get(
  "/validate-session",
  authController.validateSession.bind(authController),
);

export default router;
