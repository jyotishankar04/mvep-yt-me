import type { NextFunction, Request, Response } from "express";
import CategoryService from "../services/category.service";
import { createCategorySchema, updateCategorySchema } from "../validator/category.validator";
import { ValidationError } from "../middlewares/error-handler";

class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    async createCategory(req: Request, res: Response,next: NextFunction) {
        try {
            const body = createCategorySchema.safeParse(req.body);
            if (!body.success) {
                return next(new ValidationError("Invalid request data", body.error.issues));
            }
            const category = await this.categoryService.createCategory(body.data);
            return res.status(201).json({
                message: "Category created successfully",
                success: true,
                data: category
            });
        } catch (error) {
            return next(error);
        }
    }   
    async getCategories(req: Request, res: Response,next: NextFunction) {
        try {
            const categories = await this.categoryService.getCategories();
            return res.status(200).json({
                message: "Categories fetched successfully",
                success: true,
                data: categories
            });
        } catch (error) {
            return next(error);
        }
    }
    async getCategory(req: Request, res: Response,next: NextFunction) {
        try {
            const category = await this.categoryService.getCategory(req.params.id);
            return res.status(200).json({
                message: "Category fetched successfully",
                success: true,
                data: category
            });
        } catch (error) {
            return next(error);
        }
    }
    async updateCategory(req: Request, res: Response,next: NextFunction) {
        try {
            const body = updateCategorySchema.safeParse(req.body);
            if (!body.success) {
                return next(new ValidationError("Invalid request data", body.error.issues[0].message));
            }
            const category = await this.categoryService.updateCategory(req.params.id, req.body);
            return res.status(200).json({
                message: "Category updated successfully",
                success: true,
                data: category
            });
        } catch (error) {
            return next(error);
        }
    }
    async deleteCategory(req: Request, res: Response,next: NextFunction) {
        try {
            const category = await this.categoryService.deleteCategory(req.params.id);
            return res.status(200).json({
                message: "Category deleted successfully",
                success: true,
                data: category
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default CategoryController;