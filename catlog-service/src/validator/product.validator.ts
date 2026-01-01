import { z } from "zod";
import { SpecDataType } from "./category.validator";

export const createProductSpecificationSchema = z.object({
    id: z.string().optional(),
    key: z.string().min(1, { message: "Key is required" }),
    type: z.nativeEnum(SpecDataType, { message: "Type is required" }),
    required: z.boolean().optional().default(true),
    isVariant: z.boolean().optional().default(false)
});

export const variantSpecificationValueSchema = z.object({
  specificationId: z.string({
    message: "Invalid specification id"
  }),
  value: z.string().min(1, {
    message: "Variant specification value is required"
  })
});

export const createProductVariantSchema = z.object({
    id: z.string().optional(),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.number().positive({ message: "Price must be positive" }),
  stock: z.number().int().min(0),

  specifications: z
    .array(variantSpecificationValueSchema)
    .min(1, { message: "Variant must have specifications" })
});



export const productSpecificationValueSchema = z.object({
  specificationId: z.string({
    message: "Invalid specification id"
  }),
  value: z.string().min(1, {
    message: "Specification value is required"
  })
});

export const createProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  brand: z.string().optional(),

  basePrice: z.number().positive({ message: "Base price is required" }),
  discountPrice: z.number().positive().optional(),

  isActive: z.boolean().optional().default(true),
  stock: z.number().int().min(0),

  categoryId: z.string(),
  shopId: z.string(),

  // product-level (non-variant) specs
  specifications: z
    .array(productSpecificationValueSchema)
    .optional()
    .default([]),

  // actual variants
  variants: z
    .array(createProductVariantSchema)
    .min(1, { message: "At least one variant is required" })
});


export type CreateProductSchema = z.infer<typeof createProductSchema>;