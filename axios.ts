import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: 'https://api.zentro.dvls.com.br',
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