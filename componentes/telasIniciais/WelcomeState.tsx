'use client'
import { motion } from 'framer-motion';
import Button from '../button';

type WelcomeProps = {
    criarConta: () => void
}

export default function WelcomeState({ criarConta }: WelcomeProps) {
    return (
        <>
            <div className="min-h-[80vh] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    {/* Ícone ou Ilustração Abstrata */}

                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="overflow-hidden w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <img className='' src="/logo.png" alt="logo" />
                            </div>
                            {/* Efeito de brilho atrás */}
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl -z-10" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-zinc-100 tracking-tight mb-4">
                        Bem-vindo ao Zen<span className="text-emerald-400">tro</span>
                    </h1>

                    <p className="text-zinc-500 mb-10 leading-relaxed">
                        Parece que você ainda não criou nem faz parte de nenhuma conta.
                        Vamos começar sua jornada financeira hoje?
                    </p>

                    <div className="flex flex-col gap-4">
                        <Button
                            texto="Criar meu primeiro espaço"
                            variant="primary"
                            onClick={() => criarConta()}
                        />

                    </div>

                    <p className="mt-8 text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                        Foco • Equilíbrio • Controle
                    </p>
                </motion.div>
            </div>
        </>
    );
}