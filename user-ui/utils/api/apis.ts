import { api } from "./client";
import { IOtpVerify, IResetPassword, IUserLogin, IUserRegister } from "./types";

export const registerUser = async(user:IUserRegister)=> (await api.post('/api/auth/register', user)).data;
export const registerOtpVerify = async(otp:IOtpVerify)=> (await api.post('/api/auth/verify', otp)).data;
export const loginUser = async(user:IUserLogin)=> (await api.post('/api/auth/login', user)).data;

export const forgotPassword = async(data:{email:string}) => (await api.post('/api/auth/forgot-password',data)).data;
export const forgotPasswordVerifyOtp = async(otp:IOtpVerify) => (await api.post('/api/auth/verify-forgot-password-otp',otp)).data;
export const resetPassword  = async (data:IResetPassword) => (await api.post('/api/auth/reset-password',data)).data;