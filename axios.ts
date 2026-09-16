'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(async (config) => {
    let token: string | undefined | null;

    if (typeof window !== 'undefined') {
        // Lado do Cliente (Browser)
        token = Cookies.get('token');
    } else {
        // Lado do Servidor (Node.js / Next.js)
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies(); // ADICIONE O AWAIT AQUI
            token = cookieStore.get('token')?.value;
        } catch (error) {
            console.error("Erro ao acessar cookies no servidor:", error);
        }
    }

    if (token && token !== 'undefined' && token !== 'null') {
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
        // Não força logout quando o próprio 401 veio de uma tentativa de login
        // (senha/usuário errados) — nesse caso só queremos mostrar o erro,
        // não redirecionar de volta pra /login no meio do formulário.
        const isLoginRequest = error.config?.url?.includes('/auth/login');

        if (error.response && error.response.status === 401 && !isLoginRequest) {

            Cookies.remove('token');

            if (typeof window !== 'undefined') {
                localStorage.clear();

                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);