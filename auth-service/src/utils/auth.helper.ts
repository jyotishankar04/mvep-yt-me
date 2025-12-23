import crypto from 'crypto';
import { NextFunction } from 'express';
import redis from '../config/redis';
import { sendMail } from '../config/mail';
import { ValidationError } from '../middlewares/error-handler';
import { sellers, users } from '../generated/prisma';
import prisma from '../config/prisma';

export const checkOtpRestriction = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}`)) {
        return next(new ValidationError("Account locked due to multiple failed login attempts, please try again after 30 minutes"));
    }
    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(new ValidationError("Too many requests, please wait for 1 hour before trying again"));
    }
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError("Too many requests, please wait for 1 minute before trying again"));
    }
}

export const trackOtpRequest = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");
    if (otpRequests >= 3) {
        await redis.set(`otp_spam_lock:${email}`, "true", 'EX', 3600);
        return next(new ValidationError("Account locked due to multiple failed login attempts, please try again after 1 minutes")); //Lock the account for 1 hour 
    }
    await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600);
}

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    await sendMail(email, "OTP Verification", template, { name, email, otp });

    // Save 300s expiry time with redis
    await redis.set(`otp:${email}`, otp, 'EX', 300); // Lock the account for 5 minutes
    await redis.set(`otp_cooldown:${email}`, "true", 'EX', 60);
}

export const persistUser = async (data: { name: string, email: string, password: string, phone_number?: string, country?: string, role?: string }) => {
    const { name, email, password, phone_number, country, role } = data;
    const user = {
        name,
        email,
        password,
        phone_number,
        country,
        role
    }
    // we should identify the user by decoding the token
    await redis.set(`user:${email}`, JSON.stringify(user), 'EX', 3600);
    // dont send the direct email as token ELSE encrypt it
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(`redirectToken:${token}`, email, 'EX', 300);
    return { token };
}
export const getUserFromToken = async (token: string, next: NextFunction): Promise<{ name: string, email: string, password: string, phone_number?: string, country?: string, role?: string, phone_no?: string } | void> => {
    const email = await redis.get(`redirectToken:${token}`);
    if (!email) {
        return next(new ValidationError("Invalid token"));
    }
    const user = await redis.get(`user:${email}`);
    if (!user) {
        return next(new ValidationError("Invalid token"));
    }

    return JSON.parse(user as string);
}




export const verifyOtp = async (email: string, token: string, otp: string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);
    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");
    if (!storedOtp || storedOtp !== otp) {
        if (failedAttempts >= 3) {
            await redis.set(`otp_lock:${email}`, "true", 'EX', 1800); // Lock the account for 30 minutes
            await redis.del(`otp:${email}`);
            return next(new ValidationError("Account locked due to multiple failed login attempts, please try again after 30 minutes"));
        }
        await redis.set(failedAttemptsKey, failedAttempts + 1);
        return next(new ValidationError(`Incorrect OTP. You have ${3 - failedAttempts} attempts left.`));
    }
    await redis.del(`otp:${email}`);
    await redis.del(`otp_attempts:${email}`);
    await redis.del(`otp_cooldown:${email}`);
    await redis.set(`otp_request_count:${email}`, "0");
    await redis.del(`otp_spam_lock:${email}`);
    await redis.del(`redirectToken:${token}`);
    const user = await redis.get(`user:${email}`);
    return JSON.parse(user as string);
}

export const resetPasswordToken = async (email: string) => {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(`allow_reset:${token}`, email, 'EX', 300);
    return token;
}

export const getUserFromResetToken = async (token: string, next: NextFunction) => {
    const email = await redis.get(`allow_reset:${token}`);
    if (!email) {
        return next(new ValidationError("Invalid token"));
    }
    let user: Partial<users> | null = JSON.parse((await redis.get(`user:${email}`)) as string);
    if (!user) {
        user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })
    }
    return user;
}

export const deleteSession = async (token: string, sessionId: string) => {
    await redis.del(`session:${sessionId}`);
    await redis.del(`token_blacklist:${token}`);
    await prisma.sessions.delete({
        where: {
            id: sessionId
        }
    })
    await redis.del(`redirectToken:${token}`);
}


// Seller
export const persistSeller = async (data: { name: string, email: string, password: string, phone_number?: string, country?: string }) => {
    const { name, email, password, phone_number, country } = data;
    const user = {
        name,
        email,
        password,
        phone_number,
        country,
    }
    // we should identify the user by decoding the token
    await redis.set(`user:${email}`, JSON.stringify(user), 'EX', 3600);
    // dont send the direct email as token ELSE encrypt it
    const token = crypto.randomBytes(32).toString('hex');
    await redis.set(`redirectToken:${token}`, email, 'EX', 300);
    return { token };
}

export const setSellerToRedis = async (data:sellers) => {
    await redis.setex(`sellers:${data.id}`,3600, JSON.stringify(data) );
}