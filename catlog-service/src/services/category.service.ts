import { PrismaClient, SpecDataType } from "../generated/prisma/client";
import { DatabaseError, NotFoundError } from "../middlewares/error-handler";
import { CreateCategorySchema, UpdateCategorySchema } from "../validator/category.validator";

class CategoryService {
    constructor(private readonly prisma: PrismaClient) { }
    async createCategory(data: CreateCategorySchema) {
        try {
            const dataToCreate = {
                ...data,
                id: data.id ?? undefined,
                specifications: {
                    create: data.specifications.map((specification) => ({
                        ...specification,
                        type: specification.type as SpecDataType
                    }))
                }
            }
            return this.prisma.category.create({
                data: dataToCreate,
                include: {
                    specifications: true
                }
            });
        } catch (error) {
            return new DatabaseError("Failed to create category", error);
        }
    }
    async getCategories() {
        return this.prisma.category.findMany({
            include: {
                specifications: true
            }
        });
    }
    async getCategory(id: string) {
        return this.prisma.category.findUnique({
            where: { id },
            include: {
                specifications: true,
                children: true,
                parent: true
            }
        });
    }
    async updateCategory(id: string, data: UpdateCategorySchema) {
        try {
            const category = await this.prisma.category.findUnique({
                where: { id },
                include: {
                    specifications: true
                }
            });
            if (!category) {
                return new NotFoundError("Category not found");
            }
            const specificationsToUpdate = data.specifications.length > 0 
                ? data.specifications.filter((spec) => spec.key !== undefined)
                : category.specifications.map((spec) => ({
                    key: spec.key,
                    id: spec.id ?? undefined,
                    type: spec.type,
                    required: spec.required,
                    isVariant: spec.isVariant
                }));

            const dataToUpdate: any = {
                id: data.id ?? category.id,
                name: data.name || category.name,
                slug: data.slug || category.slug,
                parentId: data.parentId !== undefined ? data.parentId : category.parentId,
                isActive: data.isActive !== undefined ? data.isActive : category.isActive,
            };

            if (specificationsToUpdate.length > 0) {
                dataToUpdate.specifications = {
                    upsert: specificationsToUpdate.map((specification) => {
                        const existingSpec = category.specifications.find(s => s.key === specification.key);
                        return {
                            where: {
                                categoryId_key: {
                                    categoryId: id,
                                    key: specification.key!
                                }
                            },
                            update: {
                                id: specification.id ?? existingSpec?.id ?? undefined,
                                type: (specification.type ?? existingSpec?.type) as SpecDataType,
                                required: specification.required ?? existingSpec?.required ?? true,
                                isVariant: specification.isVariant ?? existingSpec?.isVariant ?? false
                            },
                            create: {
                                id: specification.id ?? undefined,
                                key: specification.key!,
                                type: specification.type as SpecDataType,
                                required: specification.required ?? true,
                                isVariant: specification.isVariant ?? false
                            }
                        };
                    })
                };
            }
            return this.prisma.category.update({
                where: { id },
                data: dataToUpdate,
                include: {
                    specifications: true
                }
            });
        } catch (error) {
            return new DatabaseError("Failed to update category", error);
        }
    }
    async deleteCategory(id: string) {
        // Delete all products in the category
        await this.prisma.product.deleteMany({
            where: { categoryId: id }
        });
        // Delete all variants in the category
        await this.prisma.productVariant.deleteMany({
            where: { product: { categoryId: id } }
        });
        // Delete all specifications in the category
        await this.prisma.categorySpecification.deleteMany({
            where: { categoryId: id }
        });

        return this.prisma.category.delete({
            where: { id }
        });
    }
}

export default CategoryService;