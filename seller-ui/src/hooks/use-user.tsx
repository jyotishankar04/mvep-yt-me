import { useMutation, useQuery } from "@tanstack/react-query";
import { api, handleLogout } from "@/utils/api/client";

// Hook that fetches the current user from the API

const fetchSelelr = async () => {
    const response = await api.get('/api/auth/check-session');
    return response.data.data.user as {
        id: string,
        name: string,
        email: string,
        role: "SELLER",
    };
};

const logout = async () => {
    await api.post('/api/auth/seller/logout');
};

export const useSeller = () => {

    const { data: user,isSuccess,error, refetch, isLoading, isError } = useQuery({
        queryKey: ['seller'],
        queryFn: fetchSelelr,
        staleTime: 5 * 60 * 1000,
        retry: 1
    });

    const { mutateAsync,isSuccess: isLogoutSuccess, isError: isLogoutError, error: logoutError,isPending} = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            handleLogout()
        }
    });
    

    return { user: user, refetch, isLoading, isLoggingOut: isPending,isError, error, isSuccess, logout: mutateAsync, isLogoutSuccess, isLogoutError, logoutError };
};

