'use client'

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie'

// 1. Tipagem fiel ao seu Banco de Dados (Tabela Membros)
type MembroConta = {
    usuario_id: number;
    conta_id: number;
    nome: string;
    iniciais: string;
    papel: 'editor' | 'adm' | '';
    data_adesao: Date;
};

// 2. Tipagem fiel ao seu Banco de Dados (Tabela Contas)
type Conta = {
    id: number;
    nome: string;
    criado_por: number;
    criado_em: Date;
    ativo: boolean;
};

type TopBarProps = {
    contaAtiva: Conta;
    membros: MembroConta[];
    contasDisponiveis: Conta[];
    usuarioLogado: { id: number; nome: string; iniciais: string };
    abrirCriarConta: (e: boolean) => void;
    selecionarConta: (id: number) => void; // <--- ADICIONE ESTA LINHA
};

export default function TopBar({ contaAtiva, membros, contasDisponiveis, usuarioLogado, abrirCriarConta, selecionarConta }: TopBarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // 3. Descobre o papel do usuário logado neste espaço específico
    const meuPapelNestaConta = useMemo(() => {
        const registro = membros.find(m => m.usuario_id === usuarioLogado.id);
        return registro?.papel === 'adm' ? 'admin' : 'editor';
    }, [membros, usuarioLogado.id]);

    return (
        <nav className="w-full sticky top-0 z-100 bg-zinc-950/70 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo e Contexto do Espaço */}
                <div className="flex items-center gap-6 cursor-pointer">
                    <span onClick={() => window.location.href = '/'} className="text-zinc-100 font-bold text-xl tracking-tighter">
                        Zen<span className="text-emerald-400">tro</span>
                    </span>

                    <div className="h-6 w-px bg-zinc-800 hidden md:block" />

                    <div className="hidden md:flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em]">Espaço Ativo</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-200 font-medium italic">
                                {contaAtiva?.nome ?? 'Carregando...'}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] border uppercase font-bold ${meuPapelNestaConta === 'admin'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-zinc-800/50 text-zinc-500 border-zinc-700'
                                }`}>
                                {meuPapelNestaConta}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Facepile de Membros */}
                <div className="hidden lg:flex items-center -space-x-2">
                    {membros.map((membro) => (
                        <div
                            key={membro.usuario_id}
                            title={`${membro.nome} (${membro.papel === 'adm' ? 'Admin' : 'Editor'})`}
                            className="w-7 h-7 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 cursor-help transition-transform hover:scale-110"
                        >
                            {membro.iniciais}
                        </div>
                    ))}
                    {membros.length > 0 && (
                        <div className="pl-4 text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                            {membros.length} {membros.length === 1 ? 'membro' : 'membros'}
                        </div>
                    )}
                </div>

                {/* Perfil e Dropdown */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex cursor-pointer   items-center gap-2 p-1.5 pl-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                        >
                            <span className="text-zinc-300 text-xs font-semibold">{usuarioLogado.nome}</span>
                            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-[10px]">
                                {usuarioLogado.iniciais}
                            </div>
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute  right-0 mt-3 w-72 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-3 z-50"
                                >
                                    <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Alternar Espaços</p>
                                    <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Codigo para convites : {localStorage.getItem('id')}</p>

                                    <div className="space-y-1 mb-4 max-h-48 overflow-y-auto pr-1">
                                        {contasDisponiveis.map(conta => (
                                            <button
                                                key={conta.id}
                                                onClick={() => {
                                                    localStorage.setItem('contaAtivaId', String(conta.id));
                                                    window.location.reload();
                                                }}
                                                className={`w-full cursor-pointer flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${conta.id === contaAtiva?.id
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                                    }`}
                                            >
                                                <span className="text-xs font-medium">{conta.nome}</span>
                                                {conta.id === contaAtiva?.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => {
                                            abrirCriarConta(true)
                                            setIsMenuOpen(false)
                                        }}
                                        className="w-full cursor-pointer text-left mb-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-all">
                                        + Criar Conta
                                    </button>

                                    <div className="border-t border-zinc-800 pt-3 space-y-1">
                                        <button onClick={() => window.location.href = '/configuracao'} className="w-full cursor-pointer text-left px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-xl transition-all">
                                            Configurações
                                        </button>
                                        <button
                                            onClick={() => {
                                                localStorage.clear();
                                                Cookies.remove('token')
                                                window.location.href = '/login';
                                            }}
                                            className="w-full cursor-pointer text-left px-3 py-2 text-xs text-pink-500 hover:bg-pink-500/10 rounded-xl transition-all font-semibold"
                                        >
                                            Sair do Zentro
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </nav>
    );
}