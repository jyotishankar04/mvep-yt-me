import { api } from "./client";
import type { IOtpVerify, IResetPassword, ISellerRegister, ISetupSeller, IUserLogin} from "@/types/api.type";

export const registerSeller = async (data: ISellerRegister) => (await api.post('/api/auth/seller/register', data)).data;
export const otpVerify = async (data: IOtpVerify) => (await api.post('/api/auth/seller/verify', data)).data;
export const setupSeller = async (data: ISetupSeller) => (await api.post('/api/auth/seller/setup', data)).data;
export const login = async (data: IUserLogin) => (await api.post('/api/auth/seller/login', data)).data;

