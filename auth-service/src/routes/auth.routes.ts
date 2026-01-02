// src/modules/auth/auth.routes.ts
import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import prisma from "../config/prismaclient.config";
import OtpService from "../services/otp.service";
import RedisService from "../services/redis.service";
import MailService from "../services/mail.service";
import transporter from "../config/mail.config";
import AuthService from "../services/auth.service";

const router = Router();

// instantiate controller (simple DI for now)
const authService = new AuthService(prisma);
const redisService = new RedisService();
const otpService = new OtpService(redisService);
const mailService = new MailService(transporter);
const authController = new AuthController(authService, otpService, mailService);

/**
 * --------------------
 * Auth routes
 * --------------------
 */

// Register user (send OTP)
router.post("/register", authController.registerUser.bind(authController));

export default router;
