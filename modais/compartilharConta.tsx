'use client'

import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { api } from '@/axios';
import Swal from 'sweetalert2';
import Button from '@/componentes/button';

type Props = {
    contaId: number;
    onClose: () => void;
}

export default function CompartilharConta({ contaId, onClose }: Props) {
    const [enviando, setEnviando] = useState(false);

    async function handleEnviarConvite(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setEnviando(true);

        const formData = new FormData(e.currentTarget);
        const usuario_id = formData.get('usuario_id');
        const papel = formData.get('papel');

        try {
            // Rota que criamos para inserir na tabela 'solicitacoes'
            await api.post(`/contas/${contaId}/compartilhar`, {
                usuario_id: Number(usuario_id),
                papel: papel
            });

            Swal.fire({
                title: 'Convite Enviado!',
                text: 'O usuário receberá uma notificação para aceitar.',
                icon: 'success',
                background: '#18181b',
                color: '#fff',
                confirmButtonColor: '#10b981'
            });

            onClose();
        } catch (error: any) {
            const mensagem = error.response?.data?.error || "Erro ao enviar convite.";
            Swal.fire('Erro', mensagem, 'error');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-8 shadow-2xl"
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-zinc-100">Convidar Membro</h2>
                        <p className="text-zinc-500 text-sm">Compartilhe este espaço financeiro com outra pessoa.</p>
                    </div>

                    <form onSubmit={handleEnviarConvite} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">ID do Usuário</label>
                            <input
                                name="usuario_id"
                                type="number"
                                required
                                placeholder="Ex: 123"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nível de Acesso</label>
                            <select
                                name="papel"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-all appearance-none"
                            >
                                <option value="editor">Editor (Adiciona transações)</option>
                                <option value="adm">Administrador (Total)</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors font-bold uppercase text-xs tracking-widest"
                            >
                                Cancelar
                            </button>
                            <div className="flex-1">
                                <Button
                                    texto={enviando ? "Enviando..." : "Enviar Convite"}
                                    variant="primary"
                                />
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}