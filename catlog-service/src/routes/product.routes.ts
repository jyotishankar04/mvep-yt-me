import { Router } from "express";
import ProductService from "../services/product.service";
import ProductController from "../controllers/product.controller";
import { authenticate } from "../middlewares/authentication/auth.middleware";
import { ROLES, requireRole } from "../middlewares/authentication/role.middlewares";
import prisma from "../config/prisma";

const router = Router();
const productService = new ProductService(prisma);
const productController = new ProductController(productService);


// No post work for admin 
//  seller will create and update product and variants
// seller will manage product and variants
// then it is served to the user and other services

// router.get("/", productController.getProducts.bind(productController));
// router.get("/:id", productController.getProduct.bind(productController));
router.post("/", authenticate, requireRole(ROLES.SELLER), productController.createProduct.bind(productController));
// router.put("/:id", authenticate, requireRole(ROLES.SELLER), productController.updateProduct.bind(productController));
// router.delete("/:id", authenticate, requireRole(ROLES.SELLER), productController.deleteProduct.bind(productController));



export default router;
