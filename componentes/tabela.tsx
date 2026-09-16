'use client'

import { api } from '@/axios';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { categoriasPorTipo } from '@/lib/categorias';

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: 'receita' | 'despesa';
    categoria: string;
    data_transacao: string;
}

type TabelaProps = {
    transacoes: Transacao[]
    alterarTransacoes: (transacoes: Transacao[]) => void;
}

export default function Tabela({ transacoes, alterarTransacoes }: TabelaProps) {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    function formatarMoeda(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    function formatarData(isoString: string) {
        // data_transacao é uma coluna DATE (sem hora/fuso) no banco. O Postgres/pg
        // devolve algo como "2026-08-20T00:00:00.000Z"; converter isso pra um fuso
        // específico (ex: America/Sao_Paulo, UTC-3) joga a data um dia pra trás.
        // Como não há componente de hora real, extraímos ano/mês/dia direto da string.
        const [ano, mes, dia] = isoString.split('T')[0].split('-');
        return `${dia}/${mes}/${ano}`;
    }
    function gerarOptionsCategoria(tipo: 'receita' | 'despesa', categoriaAtual?: string) {
        // Categoria é salva em minúsculo (ver novaTransacao.tsx / lib/categorias.ts) —
        // manter o mesmo padrão aqui, senão a edição grava "Alimentação" enquanto a
        // criação grava "alimentação", duplicando a categoria no gráfico de pizza.
        return categoriasPorTipo(tipo).map(cat =>
            `<option value="${cat.toLowerCase()}" ${categoriaAtual === cat.toLowerCase() ? 'selected' : ''}>${cat}</option>`
        ).join('');
    }

    function editar(id: number, transacao: Transacao) {
        const optionsCategorias = gerarOptionsCategoria(transacao.tipo, transacao.categoria);

        Swal.fire({
            title: 'Editar Transação',
            html: `
            <div class="flex flex-col gap-4 text-left">
                <div>
                    <label class="text-xs text-zinc-400 font-bold uppercase">Descrição</label>
                    <input id="swal-descricao" class="w-full p-2 mt-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm" value="${transacao.descricao}">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-xs text-zinc-400 font-bold uppercase">Valor</label>
                        <input id="swal-valor" type="number" step="0.01" class="w-full p-2 mt-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm" value="${transacao.valor}">
                    </div>
                    <div>
                        <label class="text-xs text-zinc-400 font-bold uppercase">Tipo</label>
                        <select id="swal-tipo" class="w-full p-2 mt-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm">
                            <option value="receita" ${transacao.tipo === 'receita' ? 'selected' : ''}>Receita</option>
                            <option value="despesa" ${transacao.tipo === 'despesa' ? 'selected' : ''}>Despesa</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="text-xs text-zinc-400 font-bold uppercase">Categoria</label>
                    <select id="swal-categoria" class="w-full p-2 mt-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm">
                        ${optionsCategorias}
                    </select>
                </div>
                <div>
                    <label class="text-xs text-zinc-400 font-bold uppercase">Data</label>
                    <input id="swal-data" type="date" class="w-full p-2 mt-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm" value="${transacao.data_transacao.split('T')[0]}">
                </div>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10b981',
            background: '#000', // Fundo preto para combinar com sua tabela
            color: '#fff',
            didOpen: () => {
                const tipoSelect = document.getElementById('swal-tipo') as HTMLSelectElement;
                const categoriaSelect = document.getElementById('swal-categoria') as HTMLSelectElement;

                tipoSelect.addEventListener('change', () => {
                    const novoTipo = tipoSelect.value as 'receita' | 'despesa';
                    // Ao trocar o tipo, tenta manter a mesma categoria selecionada
                    // se ela existir na lista do novo tipo; senão, limpa a seleção.
                    const categoriaAtual = categoriaSelect.value;
                    const novasCategorias = categoriasPorTipo(novoTipo);
                    const mantemCategoria = novasCategorias.some(c => c.toLowerCase() === categoriaAtual);
                    categoriaSelect.innerHTML = gerarOptionsCategoria(novoTipo, mantemCategoria ? categoriaAtual : undefined);
                });
            },
            preConfirm: () => {
                const descricao = (document.getElementById('swal-descricao') as HTMLInputElement).value;
                const valor = parseFloat((document.getElementById('swal-valor') as HTMLInputElement).value);
                const tipo = (document.getElementById('swal-tipo') as HTMLSelectElement).value;
                const categoria = (document.getElementById('swal-categoria') as HTMLSelectElement).value;
                const data_transacao = (document.getElementById('swal-data') as HTMLInputElement).value;

                if (!descricao || isNaN(valor) || !data_transacao) {
                    Swal.showValidationMessage('Preencha os campos obrigatórios!');
                    return false;
                }

                return { descricao, valor, tipo, categoria, data_transacao };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                api.put(`/transacoes/${id}`, result.value)
                    .then(() => {
                        Swal.fire({ icon: 'success', title: 'Sucesso!', timer: 1000, showConfirmButton: false, background: '#000', color: '#fff' });

                        // Atualiza a lista original via prop
                        alterarTransacoes(transacoes.map(t =>
                            t.id === id ? { ...t, ...result.value } : t
                        ));
                    })
                    .catch(() => Swal.fire({ icon: 'error', title: 'Erro ao salvar', background: '#000', color: '#fff' }));
            }
        });
    }

    function excluir(id: number, descricao: string) {
        Swal.fire({
            title: 'Tem certeza?',
            text: `Você deseja excluir a transação " ${descricao} "?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/transacoes/${id}`)
                    .then(() => {
                        Swal.fire(
                            'Excluído!',
                            'A transação foi excluída.',
                            'success'
                        ).then(() => {
                            alterarTransacoes(transacoes.filter(t => t.id !== id));
                        });
                    })
                    .catch(() => {
                        Swal.fire(
                            'Erro!',
                            'Ocorreu um erro ao excluir a transação.',
                            'error'
                        );
                    });
            }
        });
    }

    return (
        <div className="w-full mt-6">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-800">
                        <th className="pb-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">Descrição</th>
                        <th className="hidden md:table-cell pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 px-2 w-32 text-center">Categoria</th>
                        <th className="hidden md:table-cell pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 px-2 w-32 text-center">Data</th>
                        <th className="pb-4 text-right text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 px-2 w-32">Valor</th>
                    </tr>
                </thead>

                <motion.tbody
                    className="divide-y divide-zinc-800/50"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {transacoes.map((item) => (
                        <tr key={item.id} className="relative group overflow-hidden">
                            <td colSpan={4} className="p-0 border-none relative">

                                {/* Ações que ficam "atrás" */}
                                <div className="absolute inset-0 flex justify-end items-center gap-2 pr-4 bg-zinc-900/50">
                                    <button
                                        onClick={() => editar(item.id, item)}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-colors">
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => excluir(item.id, item.descricao)}
                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-md transition-colors">
                                        Excluir
                                    </button>
                                </div>

                                {/* Conteúdo Arrastável */}
                                <motion.div
                                    drag="x"
                                    dragConstraints={{ left: -150, right: 0 }}
                                    dragElastic={0.05}
                                    className="relative z-10 rounded-2xl bg-zinc-900 flex items-center py-4 px-2 cursor-grab active:cursor-grabbing border-b border-zinc-800/50"
                                >
                                    {/* Coluna Descrição (Flex-1 para ocupar o resto) */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-zinc-100 text-sm md:text-base font-medium truncate group-hover:text-white transition-colors">
                                            {item.descricao}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 md:hidden">
                                            <span className="text-[10px] text-zinc-500 uppercase">{item.categoria}</span>
                                            <span className="text-[10px] text-zinc-600">•</span>
                                            <span className="text-[10px] text-zinc-500">{formatarData(item.data_transacao)}</span>
                                        </div>
                                    </div>

                                    {/* Categoria (Desktop) */}
                                    <div className="hidden md:flex items-center justify-center w-32 px-2">
                                        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-medium border border-zinc-700 whitespace-nowrap">
                                            {item.categoria}
                                        </span>
                                    </div>

                                    {/* Data (Desktop) */}
                                    <div className="hidden md:flex items-center justify-center w-32 px-2 text-zinc-500 text-sm whitespace-nowrap">
                                        {formatarData(item.data_transacao)}
                                    </div>

                                    {/* Valor */}
                                    <div className={`flex items-center justify-end w-32 px-2 font-bold text-sm md:text-base whitespace-nowrap ${item.tipo === 'despesa' ? 'text-pink-400' : 'text-emerald-400'
                                        }`}>
                                        {item.tipo === 'despesa' ? '- ' : '+ '}
                                        {formatarMoeda(item.valor)}
                                    </div>
                                </motion.div>
                            </td>
                        </tr>
                    ))}
                </motion.tbody>
            </table>

            {transacoes.length === 0 && (
                <div className="py-10 text-center text-zinc-600 italic text-sm">
                    Nenhuma transação encontrada nesta conta.
                </div>
            )}
        </div>
    )
}