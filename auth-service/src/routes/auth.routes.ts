import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/authentication/auth.middleware";

const router = Router();
const authController = new AuthController();
router.post("/register", authController.userRegistration.bind(authController));
router.post("/verify", authController.verifyUser.bind(authController));
router.post("/login", authController.loginUser.bind(authController));
router.post(
  "/forgot-password",
  authController.forgotUserPassword.bind(authController),
);
router.post(
  "/verify-forgot-password-otp",
  authController.verifyForgotPasswordOtp.bind(authController),
);
router.post(
  "/reset-password",
  authController.resetUserPassword.bind(authController),
);
router.get(
  "/check-session",
  authenticate,
  authController.checkSession.bind(authController),
);
router.get("/refresh-token", authController.refreshToken.bind(authController));
router.post(
  "/logout",
  authenticate,
  authController.logoutUser.bind(authController),
);


// seller routes
router.post("/seller/register", authController.sellerRegistration.bind(authController));
router.post("/seller/verify", authController.verifySeller.bind(authController));
router.post("/seller/login", authController.loginSeller.bind(authController));


export default router;
