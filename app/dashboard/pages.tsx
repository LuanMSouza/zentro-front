'use client'

import Container from '@/componentes/container'
import NovaTransacao from '@/modais/novaTransacao'
import TopBar from '@/componentes/topbat'
import { useEffect, useMemo, useState } from 'react'
import { api } from '@/axios'
import Contas from '@/componentes/conta'
import VariasContas from '@/componentes/telasIniciais/variascontas'
import WelcomeState from '@/componentes/telasIniciais/WelcomeState'
import NovaConta from '@/modais/criarConta'
import Swal from 'sweetalert2'
import CardConvite from '@/componentes/CardConvite'
import CompartilharConta from '@/modais/compartilharConta'

type ContasBody = {
    id: number;
    nome: string;
    criado_por: number;
    criado_em: Date;
    ativo: boolean;
    papel: string;
    role: 'editor' | 'admin' | '';
}

export default function DashBoard() {
    const [listaContas, setListaContas] = useState<ContasBody[]>([]);
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null); // Estado para a troca de conta
    const [transacoes, setTransacoes] = useState<any[]>([]);
    const [usuariosNaConta, setUsuariosNaConta] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    const [novaTransacao, setNovaTransacao] = useState(false);
    const [criarConta, setCriarConta] = useState(false);
    const [compartilharConta, setCompartilharConta] = useState(false);


    const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

    // convites
    const [convites, setConvites] = useState<any[]>([]);

    useEffect(() => {
        async function checarConvites() {
            try {
                const res = await api.get('/contas/convites/pendentes');
                setConvites(res.data);
            } catch (e) { console.error(e); }
        }

        if (usuarioLogado) {
            checarConvites();
            const interval = setInterval(checarConvites, 60000);
            return () => clearInterval(interval);
        }
    }, [usuarioLogado]);

    async function responderConvite(id: number, aceito: boolean) {
        try {
            await api.post(`/contas/convites/${id}/responder`, { aceito });

            setConvites(prev => prev.filter(c => c.solicitacao_id !== id));

            if (aceito) {
                Swal.fire('Boa!', 'Agora você faz parte desta conta.', 'success');
                pegarContas(); // Recarrega a lista de contas lateral
            }
        } catch (e) {
            Swal.fire('Erro', 'Não foi possível responder o convite.', 'error');
        }
    }

    // --
    useEffect(() => {
        const id = localStorage.getItem('id');
        const nome = localStorage.getItem('nome');
        const salvoId = localStorage.getItem('contaAtivaId');

        if (id && nome) {
            setUsuarioLogado({
                id: Number(id),
                nome: nome,
                iniciais: nome.substring(0, 2).toUpperCase()
            });
        }
        if (salvoId) setIdSelecionado(Number(salvoId));

        pegarContas();
    }, []);

    // 3. Conta Ativa (Agora ela busca pelo ID selecionado ou pega a primeira disponível)
    const contaAtiva = useMemo(() => {
        return listaContas.find(c => c.id === idSelecionado) || listaContas[0];
    }, [listaContas, idSelecionado]);

    // 4. Função para trocar de conta
    const mudarConta = (id: number) => {
        localStorage.setItem('contaAtivaId', String(id));
        setIdSelecionado(id);
    };

    async function pegarContas() {
        try {
            const response = await api.get('/contas');
            const dados = response.data.contas || response.data;
            setListaContas(dados);
        } catch (error) {
            console.error("Erro ao buscar contas:", error);
        } finally {
            setCarregando(false);
        }
    }

    async function pegarDadosDaConta() {
        if (!contaAtiva?.id) return;
        try {
            const resposta = await api.get(`/contas/${contaAtiva.id}`);
            setTransacoes(resposta.data.transacoes || []);
            setUsuariosNaConta(resposta.data.usuarios || []);
        } catch (error) {
            console.error("Erro ao buscar dados da conta:", error);
        }
    }

    // 5. Busca dados sempre que a conta ativa mudar
    useEffect(() => {
        if (contaAtiva?.id) pegarDadosDaConta();
    }, [contaAtiva?.id]);

    // 6. Cálculos de Saldo e Gráfico (Memoizados)
    const { receitas, despesas } = useMemo(() => {
        return transacoes.reduce((acc, t) => {
            const v = Number(t.valor);
            if (t.tipo === 'receita') acc.receitas += v;
            else acc.despesas += v;
            return acc;
        }, { receitas: 0, despesas: 0 });
    }, [transacoes]);

    const dadosGraficoPizza = useMemo(() => {
        const categoriasMap = transacoes
            .filter(t => t.tipo === 'despesa')
            .reduce((acc, curr) => {
                acc[curr.categoria] = (acc[curr.categoria] || 0) + Number(curr.valor);
                return acc;
            }, {} as Record<string, number>);

        const cores: Record<string, string> = {
            'lazer': '#f472b6', 'alimentação': '#34d399', 'saúde': '#60a5fa', 'trabalho': '#8b5cf6'
        };

        return Object.keys(categoriasMap).map(cat => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            value: categoriasMap[cat],
            color: cores[cat.toLowerCase()] || '#71717a'
        }));
    }, [transacoes]);

    // 7. Verificação de Carregamento
    if (carregando || !usuarioLogado) {
        return <Container><p className="py-20 text-center text-zinc-500">Carregando Zentro...</p></Container>;
    }

    // 8. Logica de Telas (Early Returns)
    if (listaContas.length === 0) {
        return (
            <>
                <TopBar
                    contaAtiva={null as any} membros={[]} contasDisponiveis={[]}
                    usuarioLogado={usuarioLogado} abrirCriarConta={setCriarConta}
                    selecionarConta={() => { }}
                />
                <WelcomeState
                    criarConta={() => setCriarConta(true)} />


                {convites.length > 0 && (
                    <CardConvite
                        convite={convites[0]}
                        onResponder={responderConvite}
                    />
                )}

                {criarConta &&
                    <NovaConta onClose={() => setCriarConta(false)}
                        atualizarContas={(d) => setListaContas(prev => [...prev, d.conta])} />}
            </>
        );
    }

    // Se houver várias contas e nenhuma selecionada ainda (e não estiver no Dashboard principal)
    if (listaContas.length > 1 && !idSelecionado) {
        return (
            <>
                <TopBar
                    contaAtiva={null as any} membros={[]} contasDisponiveis={[]}
                    usuarioLogado={usuarioLogado} abrirCriarConta={setCriarConta}
                    selecionarConta={() => { }}
                />
                <VariasContas listaContas={listaContas} selecionar={mudarConta} />
            </>
        )
    }

    return (
        <>
            <TopBar
                contaAtiva={contaAtiva}
                membros={usuariosNaConta}
                contasDisponiveis={listaContas}
                usuarioLogado={usuarioLogado}
                abrirCriarConta={setCriarConta}
                selecionarConta={mudarConta} // Passar a função de troca para o TopBar
            />

            <Container>
                <Contas
                    modalTransacao={setNovaTransacao}
                    receitas={receitas}
                    despesas={despesas}
                    transacoes={transacoes}
                    dadosGraficoPizza={dadosGraficoPizza}
                    modalCompartilhar={() => setCompartilharConta(true)}
                />
            </Container>

            {/* Modais Renderizados Fora do Fluxo Principal */}
            {novaTransacao && (
                <NovaTransacao
                    contaId={contaAtiva.id}
                    onClose={() => setNovaTransacao(false)}
                    atualizar={(nova) => setTransacoes(prev => [nova, ...prev])}
                />
            )}

            {criarConta && (
                <NovaConta
                    onClose={() => setCriarConta(false)}
                    atualizarContas={(dados) => {
                        const nova = { ...dados.conta, role: 'admin' };
                        setListaContas(prev => [...prev, nova]);
                        mudarConta(nova.id); // Já abre na conta nova
                    }}
                />
            )}

            {convites.length > 0 && (
                <CardConvite
                    convite={convites[0]}
                    onResponder={responderConvite}
                />
            )}

            {compartilharConta && (
                <CompartilharConta
                    contaId={contaAtiva.id}
                    onClose={() => setCompartilharConta(false)}
                />
            )}
        </>
    );
}