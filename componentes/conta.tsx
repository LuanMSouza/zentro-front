import Button from "./button";
import Card from "./card";
import Graficos from "./graficos";
import Tabela from "./tabela";

type contasBody = {
    modalTransacao: (e: boolean) => void,
    modalCompartilhar: (e: boolean) => void,
    receitas: number,
    despesas: number,
    transacoes: Transacao[],
    dadosGraficoPizza: GraficoItem[]
}

interface Transacao {
    id: number;
    descricao: string;
    valor: number;
    tipo: 'receita' | 'despesa';
    categoria: string;
    data_transacao: string;
}

type GraficoItem = {
    name: string;
    value: number;
    color: string;
}

export default function Contas({ 
    modalTransacao, 
    receitas, 
    despesas, 
    transacoes, 
    dadosGraficoPizza, 
    modalCompartilhar 
}: contasBody) {
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
                        Controle Financeiro
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Gerencie suas movimentações e membros da conta.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Botão de Convidar/Compartilhar */}
                    <button 
                        onClick={() => modalCompartilhar(true)}
                        className="flex-1 cursor-pointer md:flex-none px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
                        Convidar
                    </button>

                    <Button onClick={() => modalTransacao(true)} texto="+ Nova Transação" variant="primary" />
                </div>
            </div>

            <div className="flex flex-wrap gap-6 w-full justify-between mb-12">
                <Card titulo="Entradas" dado={receitas} />
                <Card titulo="Saídas" dado={despesas * -1} />
                <Card titulo="Saldo Total" dado={receitas - despesas} />
            </div>

            <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-zinc-300">Transações Recentes</h2>
                    <span className="text-xs text-zinc-500 font-mono uppercase">Março 2026</span>
                </div>
                <Tabela transacoes={transacoes} />
            </div>

            <Graficos data={dadosGraficoPizza} />
        </>
    )
}