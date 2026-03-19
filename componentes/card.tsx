import Contador from "./contador";

type CardProps = {
    titulo: string,
    dado: number,
}

export default function Card({ titulo, dado }: CardProps) {
    const isNegative = dado < 0;

    // Cores modernas: Verde Esmeralda e Rosa Choque suave
    const textColor = isNegative ? 'text-pink-400' : 'text-emerald-400';
    const borderColor = isNegative ? 'border-l-pink-500' : 'border-l-emerald-500';

    function formatarValor(valor: number) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    return (
        <div className={`
            ${borderColor} 
            bg-zinc-900/50 
            border-l-4 
            cursor-default
            border-t border-r border-b border-zinc-800
            flex flex-col items-start 
            w-full md:w-3/12 
            p-5 
            rounded-xl 
            shadow-2xl 
            backdrop-blur-sm
            transition-all hover:scale-[1.02]
        `}>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">
                {titulo}
            </p>
            <p className={`text-2xl font-semibold ${textColor}`}>
                <Contador valor={dado} />
            </p>
        </div>
    )
}