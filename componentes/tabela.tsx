'use client'

import { motion, Variants } from 'framer-motion';

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
}

export default function Tabela({ transacoes }: TabelaProps) {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2 
            }
        }
    };

    function formatarMoeda(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    function formatarData(isoString: string) {
        const date = new Date(isoString);
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // meses começam do 0
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    return (
        <div className="w-full overflow-hidden mt-6">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-zinc-800">
                        <th className="pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Descrição</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Categoria</th>
                        <th className="pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Data</th>
                        <th className="pb-4 text-right text-xs font-bold uppercase tracking-widest text-zinc-500">Valor</th>
                    </tr>
                </thead>

                {/* 1. Transformamos o tbody em motion.tbody para controlar os filhos */}
                <motion.tbody
                    className="divide-y divide-zinc-800/50"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {transacoes.map((item) => (
                        /* 2. Transformamos a tr em motion.tr */
                        <motion.tr
                            key={item.id}
                            variants={itemVariants}
                            className="group hover:bg-zinc-800/30 transition-colors"
                        >
                            <td className="py-4">
                                <p className="text-zinc-100 font-medium group-hover:text-white transition-colors">
                                    {item.descricao}
                                </p>
                            </td>
                            <td className="py-4">
                                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700">
                                    {item.categoria}
                                </span>
                            </td>
                            <td className="py-4 text-zinc-500 text-sm">
                                {formatarData(item.data_transacao)}
                            </td>
                            <td className={`py-4 text-right font-semibold ${item.tipo === 'despesa' ? 'text-pink-400' : 'text-emerald-400'
                                }`}>
                                {item.tipo === 'despesa' ? '- ' : '+ '}
                                {formatarMoeda(item.valor)}
                            </td>
                        </motion.tr>
                    ))}
                </motion.tbody>
            </table>

            {transacoes.length === 0 && (
                <div className="py-10 text-center text-zinc-600 italic">
                    Nenhuma transação encontrada nesta conta.
                </div>
            )}
        </div>
    )
}