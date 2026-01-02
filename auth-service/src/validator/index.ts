import { z } from "zod";

export const userRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(3),
}).transform((data) => {
    return {
        email: data.email.trim().toLowerCase(),
        password: data.password.trim(),
        name: data.name.trim(),
    }
});



export type UserRegisterSchema = z.infer<typeof userRegisterSchema>