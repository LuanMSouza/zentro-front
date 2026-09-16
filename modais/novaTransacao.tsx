'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/componentes/button';
import React, { useState } from 'react';
import { api } from '@/axios';
import Swal from 'sweetalert2';
import { categoriasPorTipo } from '@/lib/categorias';

type ModalProps = {
    onClose: () => void;
    contaId: number,
    atualizar: ([]: any) => void
}

function dataLocalDeHoje() {
    // Usa o fuso local do navegador (não UTC) pra não cair no dia seguinte
    // em transações lançadas à noite no Brasil.
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

export default function NovaTransacao({ onClose, contaId, atualizar }: ModalProps) {
    const [tipo, setTipo] = useState<'despesa' | 'receita'>('despesa');
    const categorias = categoriasPorTipo(tipo);

    async function enviarTransacao(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const dados = Object.fromEntries(formData.entries());

        const enviar = {
            conta_id: contaId,
            descricao: dados.descricao,
            valor: dados.valor,
            tipo: dados.tipo,
            categoria: dados.categoria,
            data_transacao: dados.data_transacao || dataLocalDeHoje()

        }

        try {
            const response = await api.post('/transacoes', enviar)

            Swal.fire('Sucesso!!', 'Transação cadastrada!', 'success')
            atualizar(response.data)
            onClose()
        } catch (error: any) {
            const mensagemErro = error.response?.data?.message || error.message || "Erro desconhecido";

            console.error("Erro na API:", mensagemErro);

            Swal.fire('Erro!', mensagemErro, 'error');
        }

    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-3xl p-8 shadow-2xl"
                >
                    <h2 className="text-2xl font-bold text-zinc-100 mb-6">Nova Transação</h2>

                    <form onSubmit={enviarTransacao} className="space-y-5">
                        {/* Descrição */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Descrição</label>
                            <input
                                type="text"
                                required
                                name='descricao'
                                placeholder="Ex: Aluguel, Supermercado..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>

                        {/* Valor e Tipo */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Valor</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    name='valor'
                                    placeholder="R$ 0,00"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Tipo</label>
                                <select
                                    name='tipo'
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value as 'despesa' | 'receita')}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-400 focus:border-emerald-500 outline-none transition-colors"
                                >
                                    <option value="despesa">Despesa</option>
                                    <option value="receita">Receita</option>
                                </select>
                            </div>
                        </div>

                        {/* Data */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Data</label>
                            <input
                                type="date"
                                name='data_transacao'
                                defaultValue={dataLocalDeHoje()}
                                required
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>

                        {/* Categoria */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Categoria</label>
                            <select
                                key={tipo}
                                defaultValue=""
                                required
                                name='categoria'
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-400 focus:border-emerald-500 outline-none transition-colors appearance-none cursor-pointer hover:border-zinc-700"
                            >
                                <option value="" disabled>Selecione uma categoria...</option>
                                {categorias.map((cat) => (
                                    <option key={cat} value={cat.toLowerCase()}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="cursor-pointer flex-1 px-6 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-800 transition-colors font-bold uppercase text-xs tracking-widest"
                            >
                                Cancelar
                            </button>
                            <div className="flex-1">
                                <Button texto="Confirmar" variant="primary" />
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}