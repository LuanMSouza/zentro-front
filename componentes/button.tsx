type BtnProps = {
    texto: string,
    variant: 'primary' | 'secondary' | 'danger' | 'ghost',
    onClick?: () => void
}

export default function Button({ texto, variant, onClick }: BtnProps) {

    const variants = {
        // O seu Bege como destaque principal
        primary: 'bg-[#F5F5DC] text-[#0B0E14] hover:bg-[#EAEAC2] shadow-[0_0_15px_rgba(245,245,220,0.2)]',

        // Dark Mode elegante (um pouco mais claro que o container)
        secondary: 'bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700',

        // Para exclusão, usando o Rosa/Coral que combinamos
        danger: 'bg-transparent border border-pink-500/50 text-pink-500 hover:bg-pink-500 hover:text-white',

        // Apenas texto, para ações secundárias
        ghost: 'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
    }

    return (
        <button
            onClick={onClick} // Se vier algo, ele executa. Se não, ignora.
            className={`
            ${variants[variant]} 
            px-6 py-2.5 
            text-sm font-bold uppercase tracking-widest
            rounded-xl 
            transition-all duration-200 
            active:scale-95 
            flex items-center justify-center gap-2
            cursor-pointer
        `}>
            {texto}
        </button>
    )
}