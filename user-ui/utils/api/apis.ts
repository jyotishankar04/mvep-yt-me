import { api } from "./client";
import { IOtpVerify, IUserLogin, IUserRegister } from "./types";

export const registerUser = async(user:IUserRegister)=> (await api.post('/api/auth/register', user)).data;
export const registerOtpVerify = async(otp:IOtpVerify)=> (await api.post('/api/auth/verify', otp)).data;
export const loginUser = async(user:IUserLogin)=> (await api.post('/api/auth/login', user)).data;

