"use client";
import { useMutation } from "@tanstack/react-query";
import { IOtpVerify, IResetPassword, IUserLogin, IUserRegister } from "../api/types";
import { forgotPassword, forgotPasswordVerifyOtp, loginUser, registerOtpVerify, registerUser, resetPassword } from "../api/apis";
import { useUser } from "@/hooks/use-user";

export const useUserRegister = () => {
    return useMutation({
        mutationFn: (user: IUserRegister) => registerUser(user)
    });
};

export const useRegisterOtpVerify = () => {
    return useMutation({
        mutationFn: (otp: IOtpVerify) => registerOtpVerify(otp)
    });
};

export const useLoginUser = () => {
    const {refetch} = useUser();
    return useMutation({
        mutationFn: (user: IUserLogin) => loginUser(user),
        onSuccess: () => {
            refetch()
        }
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data:{email:string}) => forgotPassword(data)
    });
};

export const useForgotPasswordVerifyOtp = () => {
    return useMutation({
        mutationFn: (otp: IOtpVerify) => forgotPasswordVerifyOtp(otp)
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: (data:IResetPassword) => resetPassword(data)
    });
};