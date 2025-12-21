"use client";
import { useMutation } from "@tanstack/react-query";
import type { IOtpVerify, IResetPassword, IUserLogin, ISellerRegister} from "@/types/api.type";
import { otpVerify, registerSeller } from "../api/apis";
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

// export const useLoginUser = () => {
//     // const {refetch} = useUser();
//     return useMutation({
//         mutationFn: (user: IUserLogin) => loginUser(user),
//         onSuccess: () => {
//             refetch()
//         }
//     });
// };

// export const useForgotPassword = () => {
//     return useMutation({
//         mutationFn: (data:{email:string}) => forgotPassword(data)
//     });
// };

// export const useForgotPasswordVerifyOtp = () => {
//     return useMutation({
//         mutationFn: (otp: IOtpVerify) => forgotPasswordVerifyOtp(otp)
//     });
// };

// export const useResetPassword = () => {
//     return useMutation({
//         mutationFn: (data:IResetPassword) => resetPassword(data)
//     });
// };