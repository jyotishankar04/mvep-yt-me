import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
})

// Endpoint for refreshing the tokens
// Endpoint for refreshing the tokens
const refreshToken = async () => {
    await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/auth/refresh-token', {
        withCredentials: true
    })
    return
}



let isRefreshing = false
let refreshSubscribers: (() => void)[] = []

export const handleLogout = () => {
    if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login"
    }
}

const subscribeToRefresh = (callback: () => void) => {
    refreshSubscribers.forEach((subscriber) => subscriber())
    refreshSubscribers.push(callback)
}

const onRefreshSuccess = () => {
    refreshSubscribers.forEach((subscriber) => subscriber())
    refreshSubscribers = []
}

api.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response.status.toString() === "401" || error.response.status.toString() === "403" && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeToRefresh(() => {
                        resolve(api(originalRequest))
                    })
                })
            }
            originalRequest._retry = true
            isRefreshing = true
            try {
                await refreshToken()
                onRefreshSuccess()
                return api(originalRequest)
            } catch (err) {
                handleLogout()
                refreshSubscribers = []
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)