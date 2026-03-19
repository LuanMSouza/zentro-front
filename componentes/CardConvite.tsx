'use client'
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

type ConviteProps = {
    convite: { solicitacao_id: number; nome_conta: string; convidado_por_nome: string };
    onResponder: (id: number, aceito: boolean) => void;
}

export default function CardConvite({ convite, onResponder }: ConviteProps) {
    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900 border border-emerald-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-6"
        >
            <div className="text-sm">
                <span className="text-emerald-400 font-bold">{convite.convidado_por_nome}</span>
                <span className="text-zinc-400"> convidou você para </span>
                <span className="text-white font-medium">{convite.nome_conta}</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onResponder(convite.solicitacao_id, true)}
                    className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white transition-colors"
                >
                    <Check size={18} />
                </button>
                <button
                    onClick={() => onResponder(convite.solicitacao_id, false)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </motion.div>
    );
}