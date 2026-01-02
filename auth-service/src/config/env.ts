import z from "zod"
import { config } from "dotenv";
config()
const envSchema = Object.freeze(z.object({
    NODE_ENV: z.enum(["development", "test", "production", "dev", "prod"]).default("development"),
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string(),
    MAIL_HOST: z.string(),
    MAIL_PORT: z.string(),
    MAIL_USER: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
    MAIL_PASS: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
    SMTP_USER: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_KEY_SECRET: z.string(),
    KAFKA_BROKER: z.string(),
    KAFKA_CLIENT_ID: z.string(),
    KAFKA_TOPIC: z.string(),
    KAFKA_GROUP_ID: z.string()
})).safeParse(process.env);

if(envSchema.success === false) {
    console.error("❌ Invalid environment variables:", envSchema.error.format());
    process.exit(1);
}

export const _env = envSchema && envSchema.data;