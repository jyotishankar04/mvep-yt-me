import { z } from "zod";

export const sellerRegisterSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    phoneNo: z.string().min(10).max(15),
    country: z.string().min(2),
    name: z.string().min(3),
  })
  .transform((data) => {
    return {
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      name: data.name.trim(),
      phoneNo: data.phoneNo.trim(),
      country: data.country.trim().toUpperCase(),
    };
  });

export type SellerRegisterSchema = z.infer<typeof sellerRegisterSchema>;
