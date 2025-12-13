import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
})

// Endpoint for refreshing the tokens
const refreshToken = async () => {
     await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/refresh-token',{}, {
        withCredentials: true
    })
    return
}
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
            const headers = { ...originalRequest.headers }
            await refreshToken()
            return api.request({ ...originalRequest, headers })
        } catch (err) {
            console.log(err)
            return Promise.reject(err)
        }
    }
    return Promise.reject(error)
})