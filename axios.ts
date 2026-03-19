import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        const cleanToken = token.trim().replace(/^"|"$/g, '');

        config.headers.Authorization = `Bearer ${cleanToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});