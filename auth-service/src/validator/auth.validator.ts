import z from 'zod';
import { ValidationError } from '../middlewares/error-handler';

export const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phone_number: z.string().optional(),
    country: z.string().optional(),
    role: z.enum(["admin", "user"]).default("user")
}).transform(data=>{
    return data
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
}).transform(data=>{
    return {
        email: data.email.trim(),
        password: data.password.trim()
    }
});

export const sellerRegistrationSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    phone_number: z.string().optional(),
    country: z.string().optional(),
}).transform(data=>{
    return data
});