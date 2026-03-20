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
                staggerChildren: 0.1 // Reduzi um pouco para ser mais fluido
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
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    return (
        <div className="w-full mt-6">
            <table className="w-full text-left border-collapse table-auto">
                <thead>
                    <tr className="border-b border-zinc-800">
                        <th className="pb-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">Descrição</th>
                        <th className="hidden md:table-cell pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">Categoria</th>
                        <th className="hidden md:table-cell pb-4 text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">Data</th>
                        <th className="pb-4 text-right text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 px-2">Valor</th>
                    </tr>
                </thead>

                <motion.tbody
                    className="divide-y divide-zinc-800/50"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {transacoes.map((item) => (
                        <motion.tr
                            key={item.id}
                            variants={itemVariants}
                            className="group hover:bg-zinc-800/30 transition-colors"
                        >
                            {/* Coluna Principal: No Mobile ela mostra tudo */}
                            <td className="py-4 px-2 max-w-37.5 md:max-w-none">
                                <p className="text-zinc-100 text-sm md:text-base font-medium truncate group-hover:text-white transition-colors">
                                    {item.descricao}
                                </p>
                                <div className="flex items-center gap-2 mt-1 md:hidden">
                                    <span className="text-[10px] text-zinc-500 uppercase">{item.categoria}</span>
                                    <span className="text-[10px] text-zinc-600">•</span>
                                    <span className="text-[10px] text-zinc-500">{formatarData(item.data_transacao)}</span>
                                </div>
                            </td>

                            {/* Categoria: Escondida no Mobile */}
                            <td className="hidden md:table-cell py-4 px-2">
                                <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700 whitespace-nowrap">
                                    {item.categoria}
                                </span>
                            </td>

                            {/* Data: Escondida no Mobile */}
                            <td className="hidden md:table-cell py-4 px-2 text-zinc-500 text-sm whitespace-nowrap">
                                {formatarData(item.data_transacao)}
                            </td>

                            {/* Valor: Sempre visível, alinhado à direita */}
                            <td className={`py-4 px-2 text-right font-bold text-sm md:text-base whitespace-nowrap ${item.tipo === 'despesa' ? 'text-pink-400' : 'text-emerald-400'
                                }`}>
                                {item.tipo === 'despesa' ? '- ' : '+ '}
                                {formatarMoeda(item.valor)}
                            </td>
                        </motion.tr>
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