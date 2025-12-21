import { api } from "./client";
import type { IOtpVerify, IResetPassword, ISellerRegister, IUserLogin} from "@/types/api.type";

export const registerSeller = async (data: ISellerRegister) => (await api.post('/api/auth/seller/register', data)).data;
export const otpVerify = async (data: IOtpVerify) => (await api.post('/api/auth/seller/verify', data)).data;


