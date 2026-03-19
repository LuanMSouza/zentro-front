'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/componentes/button';
import React, { useState } from 'react';
import { api } from '@/axios';
import Swal from 'sweetalert2';

type ModalProps = {
    onClose: () => void;
    atualizarContas: (novaConta: any) => void;
}

export default function NovaConta({ onClose, atualizarContas }: ModalProps) {
    const [convidar, setConvidar] = useState(false);

    async function criarConta(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const dados = Object.fromEntries(formData.entries());

        const payload = {
            nome: dados.nome_conta,
            convidado_id: dados.usuario_id ? Number(dados.usuario_id) : null
        };

        try {
            const response = await api.post('/contas/criarconta', payload);

            Swal.fire('Sucesso!', 'Conta criada com sucesso!', 'success');

            atualizarContas(response.data);
            onClose();
        } catch (error: any) {
            const msg = error.response?.data?.error || "Erro ao criar conta.";
            Swal.fire('Erro', msg, 'error');
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="relative bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-3xl p-8 shadow-2xl"
                >
                    <h2 className="text-2xl font-bold text-zinc-100 mb-2">Criar Nova Conta</h2>
                    <p className="text-zinc-500 text-sm mb-6">Configure um novo espaço para suas finanças.</p>

                    <form onSubmit={criarConta} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Nome da Conta</label>
                            <input
                                name="nome_conta"
                                type="text"
                                required
                                placeholder="Ex: Pessoal, Empresa, Viagem..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>

                        {/* Toggle de Convite */}
                        <div className="flex items-center gap-3 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                            <input
                                type="checkbox"
                                id="convite"
                                checked={convidar}
                                onChange={() => setConvidar(!convidar)}
                                className="w-5 h-5 accent-emerald-500 cursor-pointer"
                            />
                            <label htmlFor="convite" className="text-sm text-zinc-300 cursor-pointer select-none">
                                Convidar alguém agora?
                            </label>
                        </div>

                        {/* Input de ID (Só aparece se o checkbox estiver marcado) */}
                        {convidar && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">ID do Usuário</label>
                                <input
                                    name="usuario_id"
                                    type="number"
                                    required={convidar}
                                    placeholder="Digite o ID do parceiro(a)"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-all"
                                />
                                <span className="text-[10px] text-zinc-600 mt-2 block">O ID pode ser encontrado no perfil do usuário.</span>
                            </motion.div>
                        )}

                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-xl text-zinc-500 hover:text-zinc-300 transition-colors font-bold uppercase text-xs tracking-widest"
                            >
                                Cancelar
                            </button>
                            <div className="flex-1">
                                <Button texto="Criar Conta" variant="primary" />
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}