"use client";
import { useMutation } from "@tanstack/react-query";
import { IOtpVerify, IUserLogin, IUserRegister } from "../api/types";
import { loginUser, registerOtpVerify, registerUser } from "../api/apis";

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
    return useMutation({
        mutationFn: (user: IUserLogin) => loginUser(user)
    });
};