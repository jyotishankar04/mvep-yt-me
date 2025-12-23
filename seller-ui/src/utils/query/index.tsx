"use client";
import { useMutation } from "@tanstack/react-query";
import type { IOtpVerify, IUserLogin, ISellerRegister, ISetupSeller } from "@/types/api.type";
import { login, otpVerify, registerSeller, setupSeller } from "../api/apis";
// import { useUser } from "@/hooks/use-user";

export const useRegisterSeller = () => {
    return useMutation({
        mutationFn: (user: ISellerRegister) => registerSeller(user)
    });
};

export const useSellerRegisterVerify = () => {
    return useMutation({
        mutationFn: (otp: IOtpVerify) => otpVerify(otp)
    });
};

export const useSellerSetup = () => {
    return useMutation({
        mutationFn: (user: ISetupSeller) => setupSeller(user)
    });
};

export const useSellerLogin = () => {
    return useMutation({
        mutationFn: (user: IUserLogin) => login(user)
    });
};