import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');

    if (token) {
        const cleanToken = token.trim().replace(/^"|"$/g, '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {

            Cookies.remove('token');

            if (typeof window !== 'undefined') {
                localStorage.clear();

                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);