import { Router } from "express";
import AuthController from "../controllers/auth.controller";
const router = Router();
const authController = new AuthController();
router.post("/login", authController.loginAdmin.bind(authController));
router.post("/refresh", authController.refreshToken.bind(authController));
router.post("/logout", authController.logoutAdmin.bind(authController));

export default router;
