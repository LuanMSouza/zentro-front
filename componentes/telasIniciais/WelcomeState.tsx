'use client'
import { motion } from 'framer-motion';
import Button from '../button';

export default function WelcomeState() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center"
            >
                {/* Ícone ou Ilustração Abstrata */}

                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="膜3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
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
                    Como você quer começar sua jornada financeira hoje?
                </p>

                <div className="flex flex-col gap-4">
                    {/* Botão Principal: Criar */}
                    <Button
                        texto="Criar minha primeira conta"
                        variant="primary"
                        onClick={() => console.log('Abrir modal de criação')}
                    />

                    {/* Botão Secundário: Entrar em uma existente */}
                    <Button
                        texto='Pedir para entrar em uma conta'
                        variant='secondary' />
                </div>

                <p className="mt-8 text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                    Foco • Equilíbrio • Controle
                </p>
            </motion.div>
        </div>
    );
}