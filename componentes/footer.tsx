'use client'
import { motion } from 'framer-motion';

export default function Footer() {
    const anoAtual = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="w-full mt-20 pb-12 border-t border-zinc-800/30 pt-10"
        >
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-8">

                {/* Logo e Slogan - Menos técnico, mais lifestyle */}
                <div className="text-center">
                    <p className="text-zinc-100 font-bold text-2xl tracking-tighter">
                        Zen<span className="text-emerald-400">tro</span>
                    </p>
                    <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
                        Encontre o equilíbrio nas suas finanças e foque no que realmente importa.
                    </p>
                </div>

                {/* Créditos e Status - Limpo e direto */}
                <div className="flex flex-col md:flex-row items-center justify-between w-full border-t border-zinc-800/50 pt-8 gap-4">
                    <div className="text-zinc-500 text-[11px] uppercase tracking-widest">
                        &copy; {anoAtual} — {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
                    </div>

                    {/* Badge de Status - Agora mais discreto */}
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                            Cloud Active
                        </span>
                    </div>

                    <div className="text-zinc-500 text-[11px] uppercase tracking-widest">
                        By <span className="text-zinc-300">Luan Souza</span>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}