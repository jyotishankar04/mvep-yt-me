import { PrismaClient, Product, ProductVariant } from "../generated/prisma/client";
import { DatabaseError } from "../middlewares/error-handler";
import { CreateProductSchema } from "../validator/product.validator";

class ProductService {
    constructor(private readonly prisma: PrismaClient) { }
    async createProduct(data: CreateProductSchema) {
        try {
            let product: Product;
            let variants: ProductVariant[] = [];
            const productToCreate = {
                id: data.id ?? undefined,
                name: data.name,
                slug: data.slug,
                brand: data.brand,
                basePrice: data.basePrice,
                discountPrice: data.discountPrice,
                isActive: data.isActive,
                stock: data.stock,
                categoryId: data.categoryId,
                shopId: data.shopId,
                specifications: {
                    create: data.specifications.map((specification) => ({
                        specificationId: specification.specificationId,
                        value: specification.value
                    }))
                }
            }

          //   transaction to create product and variants
            await this.prisma.$transaction(async (tx) => {
                product = await tx.product.create({
                    data: productToCreate,
                    include: {
                        specifications: true
                    }
                })
                for (const variant of data.variants) {
                    variants.push(await tx.productVariant.create({
                        data: {
                            id: variant.id ?? undefined,
                            sku: variant.sku,
                            price: variant.price,
                            stock: variant.stock,
                            productId: product.id,
                            specifications: {
                                create: variant.specifications.map((specification) => ({
                                    specificationId: specification.specificationId,
                                    value: specification.value
                                }))
                            }
                        }
                    }))
                }
            });
           
            return {
                product: product!,
                variants: variants
            }
        } catch (error) {
            return new DatabaseError("Failed to create product", error);
        }
    }
}

export default ProductService;