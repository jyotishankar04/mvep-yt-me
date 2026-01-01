import { Router } from "express";
import CategoryService from "../services/category.service";
import CategoryController from "../controllers/category.controller";
import { authenticate } from "../middlewares/authentication/auth.middleware";
import { ROLES, requireRole } from "../middlewares/authentication/role.middlewares";
import prisma from "../config/prisma";

const router = Router();
const categoryService = new CategoryService(prisma);
const categoryController = new CategoryController(categoryService);
// Admin category routes
router.post("/admin", authenticate, requireRole(ROLES.SELLER), categoryController.createCategory.bind(categoryController));
router.get("/admin", authenticate, categoryController.getCategories.bind(categoryController));
router.get("/admin/:id", authenticate, categoryController.getCategory.bind(categoryController));
router.put("/admin/:id", authenticate, requireRole(ROLES.ADMIN), categoryController.updateCategory.bind(categoryController));
router.delete("/admin/:id", authenticate, requireRole(ROLES.SELLER), categoryController.deleteCategory.bind(categoryController));

// seller and user category routes
// 1. seller and user cannot create, update or delete categories
// 2. seller and user can only get categories
// 3. seller and user can only get a category by id
router.get("/", categoryController.getCategories.bind(categoryController));
router.get("/:id", categoryController.getCategory.bind(categoryController));

export default router;