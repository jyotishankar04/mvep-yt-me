import { z } from "zod";

export enum SpecDataType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    ENUM = "ENUM"
}

export const createCategorySpecificationSchema = z.object({
    id: z.string().optional(),
    key: z.string({message: "Key is required"}),
    type: z.nativeEnum(SpecDataType, {message: "Type is required"}),
    required: z.boolean().optional().default(true),
    isVariant: z.boolean().optional().default(false)
});

export const createCategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, {message: "Name is required"}),
    slug: z.string().min(1, {message: "Slug is required"}),
    parentId: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    specifications: z.array(createCategorySpecificationSchema).optional().default([])
}).transform((data) => {
    const specifications = data.specifications.map((specification) => ({
        ...specification,
        type: specification.type as SpecDataType
    }));
    return {
        ...data,
        specifications
    }
});

export const updateCategorySpecificationSchema = createCategorySpecificationSchema.partial();

export const updateCategorySchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
    parentId: z.string().optional(),
    isActive: z.boolean().optional(),
    specifications: z.array(updateCategorySpecificationSchema).optional().default([])
}).transform((data) => {
    if (!data.specifications) return data;
    const specifications = data.specifications?.map((specification) => ({
        ...specification,
        type: specification.type as SpecDataType
    }));
    return {
        ...data,
        specifications
    }
});

// Types 
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type CreateCategorySpecificationSchema = z.infer<typeof createCategorySpecificationSchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
export type UpdateCategorySpecificationSchema = z.infer<typeof updateCategorySpecificationSchema>;