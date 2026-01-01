import { NextFunction, Request, Response } from "express";
import ProductService from "../services/product.service";
import { createProductSchema } from "../validator/product.validator";
import { ValidationError } from "../middlewares/error-handler";

class ProductController {
    constructor(private readonly productService: ProductService) { }
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = createProductSchema.safeParse(req.body);
            if (!validatedData.success) {
                return next(new ValidationError("Invalid request data", validatedData.error.issues[0].message));
            }
            const product = await this.productService.createProduct(req.body);
            return res.status(201).json(product);
        } catch (error) {
            return next(error);
        }
    }
}

export default ProductController;