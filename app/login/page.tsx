'use client'
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { api } from '@/axios';
import Button from '@/componentes/button';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const formVariants: Variants = {
        hidden: { opacity: 0, x: isLogin ? -50 : 50, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            x: isLogin ? 50 : -50,
            scale: 0.95,
            transition: { duration: 0.3, ease: "easeIn" }
        }
    };

    async function cadastrar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const dados = Object.fromEntries(formData);

        try {
            await api.post('/auth/registrar', {
                nome: dados.nome,
                usuario: dados.usuario,
                email: dados.email,
                senha: dados.senha
            });

            Swal.fire({
                title: 'Conta criada!',
                text: 'Agora você já pode fazer login.',
                icon: 'success',
                background: '#18181b',
                color: '#fff',
                confirmButtonColor: '#10b981'
            });

            setIsLogin(true); // Volta para a tela de login
        } catch (error: any) {
            const mensagem = error.response?.data?.error || 'Erro ao realizar cadastro';
            Swal.fire({ title: 'Erro', text: mensagem, icon: 'error', background: '#18181b', color: '#fff' });
        } finally {
            setLoading(false);
        }
    }

    async function logar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const dados = Object.fromEntries(formData);

        try {
            const response = await api.post('/auth/login', {
                usuario: dados.usuario,
                senha: dados.senha
            });

            Cookies.set('token', response.data.token, { expires: 7, secure: true })
            localStorage.setItem('nome', response.data.nome);
            localStorage.setItem('id', response.data.id);

            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const msg = error.response?.data?.error || 'Algo deu errado com o login';
                Swal.fire({ title: 'Opa...', text: msg, icon: 'error', background: '#18181b', color: '#fff' });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center  p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="m-5 flex flex-col items-center">

                <div className='h-20 m-2 overflow-hidden'>
                    <img className='h-full drop-shadow-lg scale-105' src="/favicon-96x96.png" alt="" />
                </div>

                <span className="text-zinc-100 font-bold text-3xl tracking-tighter">
                    Zen<span className="text-emerald-400">tro</span>
                </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                className="bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800 w-full max-w-md rounded-3xl p-10 shadow-2xl relative z-10"
            >
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.form key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6 flex flex-col" onSubmit={logar}>
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Acessar sua Conta</h2>
                                <p className="text-zinc-500 text-sm mt-2">Bem-vindo de volta!</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Usuario</label>
                                <input type="text" name='usuario' required placeholder="seu_usuario" className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors" />
                            </div>

                            <div>
                                <input type="password" name='senha' required placeholder="••••••••" className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors" />
                            </div>

                            <Button texto={loading ? "Carregando..." : "Entrar no Zentro"} variant="primary" />

                            <div
                                className="text-center pt-6 border-t border-zinc-800/50 mt-8">
                                <p className="text-sm text-zinc-500 cursor-default">
                                    Ainda não tem conta?{'  '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(false)}
                                        className="text-emerald-400 font-medium cursor-pointer hover:text-emerald-300 transition-colors"
                                    >Criar conta grátis</button>
                                </p>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form key="register" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5" onSubmit={cadastrar}>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Criar Nova Conta</h2>
                                <p className="text-zinc-500 text-sm mt-2">Comece hoje a organizar suas finanças.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nome Completo</label>
                                <input type="text" name="nome" required placeholder="Luan Souza" className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
                                <input type="email" name="email" required placeholder="seu@email.com" className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Usuario</label>
                                <input type="text" name="usuario" required placeholder="um_usuario" className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Senha Forte</label>
                                <input type="password" name="senha" required placeholder="Mínimo 8 caracteres" className="w-full bg-zinc-950/70 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors" />
                            </div>

                            <Button texto={loading ? "Criando..." : "Finalizar Cadastro"} variant="primary" />

                            <div className="text-center pt-6 border-t border-zinc-800/50 mt-6">
                                <p className="text-sm text-zinc-500 cursor-default">
                                    Já possui conta?{'  '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(true)}
                                        className="text-emerald-400 cursor-pointer font-medium hover:text-emerald-300 transition-colors"
                                    >Acessar Login</button>
                                </p>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="text-center text-[10px] mt-10 mb-10  text-zinc-700 uppercase tracking-[0.3em]">
                Zentro Finance • Santos — SP
            </div>
        </div>
    );
}