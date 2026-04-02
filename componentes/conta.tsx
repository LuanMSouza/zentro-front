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
    dadosGraficoPizza: GraficoItem[],
    mes: number, // Valor que vem do pai
    ano: number, // Valor que vem do pai
    mudarMes: (e: number) => void,
    mudarAno: (e: number) => void,
    alterarTransacoes: (transacoes: Transacao[]) => void;
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
    modalCompartilhar,
    mes, // Use a prop em vez do estado local
    ano, // Use a prop em vez do estado local
    mudarMes,
    mudarAno,
    alterarTransacoes
}: contasBody) {

    const meses = [
        { v: 1, n: "Janeiro" }, { v: 2, n: "Fevereiro" }, { v: 3, n: "Março" },
        { v: 4, n: "Abril" }, { v: 5, n: "Maio" }, { v: 6, n: "Junho" },
        { v: 7, n: "Julho" }, { v: 8, n: "Agosto" }, { v: 9, n: "Setembro" },
        { v: 10, n: "Outubro" }, { v: 11, n: "Novembro" }, { v: 12, n: "Dezembro" }
    ]

    const anos = [2024, 2025, 2026, 2027]

    return (
        <>
            <div className="flex flex-col md:flex-row  justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
                        Controle Financeiro
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Gerencie suas movimentações e membros da conta.</p>
                </div>

                {/* Filtros de Data */}
                <div className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/50">

                    <div className="flex flex-col items-center px-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-600 ml-1 mb-1">Mês</label>
                        <select
                            value={mes}
                            onChange={(e) => {
                                mudarMes(Number(e.target.value))
                            }}
                            className="outline-0 border text-center border-gray-600 rounded-3xl p-1 px-3 text-zinc-300 text-sm font-medium focus:outline-none cursor-pointer hover:text-emerald-400 transition-colors"
                        >
                            {meses.map(m => (
                                <option key={m.v} value={m.v} className="bg-zinc-900 text-zinc-300">{m.n}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-px h-8 bg-zinc-800"></div>

                    <div className="flex flex-col items-center px-2">
                        <label className="text-[10px] uppercase font-bold text-zinc-600 ml-1 mb-1">Ano</label>
                        <select
                            value={ano}
                            onChange={(e) => {
                                mudarAno(Number(e.target.value))
                            }}
                            className="outline-0 border border-gray-600 rounded-3xl p-1 px-3 text-zinc-300 text-sm font-medium focus:outline-none cursor-pointer hover:text-emerald-400 transition-colors"
                        >
                            {anos.map(a => (
                                <option key={a} value={a} className="bg-zinc-900 text-zinc-300">{a}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => modalCompartilhar(true)}
                        className="flex-1 cursor-pointer md:flex-none px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="16" y1="11" x2="22" y2="11" /></svg>
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
                    <span className="text-xs text-zinc-500 font-mono uppercase">
                        {meses.find(m => m.v === mes)?.n} {ano}
                    </span>
                </div>
                <Tabela
                    alterarTransacoes={alterarTransacoes}
                    transacoes={transacoes} />
            </div>

            <Graficos data={dadosGraficoPizza} />
        </>
    )
}