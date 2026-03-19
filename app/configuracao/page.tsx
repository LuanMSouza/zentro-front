'use client'

import { useState, useEffect, useMemo } from 'react'
import Container from '@/componentes/container'
import TopBar from '@/componentes/topbat'
import Button from '@/componentes/button'
import { api } from '@/axios'
import Swal from 'sweetalert2'
import { User, LayoutGrid, Trash2 } from 'lucide-react'

export default function Configuracoes() {
    const [abaAtiva, setAbaAtiva] = useState<'perfil' | 'espaco'>('perfil')
    const [usuarioLogado, setUsuarioLogado] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    // Estados integrados
    const [listaContas, setListaContas] = useState<any[]>([])
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null)
    const [usuariosNaConta, setUsuariosNaConta] = useState<any[]>([])

    // 1. Carregar usuário e ID da conta do localStorage
    useEffect(() => {
        const id = localStorage.getItem('id')
        const nome = localStorage.getItem('nome')
        const salvoId = localStorage.getItem('contaAtivaId')

        if (id && nome) {
            setUsuarioLogado({
                id: Number(id),
                nome: nome,
                iniciais: nome.substring(0, 2).toUpperCase()
            })
        }
        if (salvoId) setIdSelecionado(Number(salvoId))

        pegarContas()
    }, [])

    // 2. Buscar lista de todas as contas
    async function pegarContas() {
        try {
            const response = await api.get('/contas')
            const dados = response.data.contas || response.data
            setListaContas(dados)
        } catch (error) {
            console.error("Erro ao buscar contas:", error)
        }
    }

    // 3. Determinar conta ativa
    const contaAtiva = useMemo(() => {
        return listaContas.find(c => c.id === idSelecionado) || listaContas[0]
    }, [listaContas, idSelecionado])

    // 4. Buscar usuários da conta ativa
    async function pegarDadosDaConta() {
        if (!contaAtiva?.id) return
        try {
            const resposta = await api.get(`/contas/${contaAtiva.id}`)
            setUsuariosNaConta(resposta.data.usuarios || [])
        } catch (error) {
            console.error("Erro ao buscar dados da conta:", error)
        }
    }

    useEffect(() => {
        if (contaAtiva?.id) pegarDadosDaConta()
    }, [contaAtiva?.id])

    // --- FUNÇÕES DE AÇÃO ---

    const mudarConta = (id: number) => {
        localStorage.setItem('contaAtivaId', String(id))
        setIdSelecionado(id)
    }

    const salvarPerfil = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputNome = (e.target as any).elements[0].value;

        setLoading(true);
        try {
            await api.put('/configuracoes/perfil', { nome: inputNome });
            localStorage.setItem('nome', inputNome);
            setUsuarioLogado({
                ...usuarioLogado,
                nome: inputNome,
                iniciais: inputNome.substring(0, 2).toUpperCase()
            });
            Swal.fire({ title: 'Sucesso', text: 'Perfil atualizado!', icon: 'success', background: '#18181b', color: '#fff' });
        } catch (error) {
            Swal.fire('Erro', 'Não foi possível salvar.', 'error');
        } finally {
            setLoading(false);
        }
    }

    const removerMembro = async (membroId: number) => {
        const result = await Swal.fire({
            title: 'Remover membro?',
            text: "O usuário perderá o acesso a este espaço.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Sim, remover',
            background: '#18181b', color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/configuracoes/espaco/${contaAtiva.id}/membros/${membroId}`);
                
                // Mudança dinâmica: Remove da lista local imediatamente usando id ou usuario_id
                setUsuariosNaConta(prev => prev.filter(u => (u.id || u.usuario_id) !== membroId));
                
                Swal.fire({ title: 'Removido!', icon: 'success', background: '#18181b', color: '#fff' });
            } catch (e) {
                Swal.fire('Erro', 'Apenas administradores podem remover membros.', 'error');
            }
        }
    };

    const excluirEspaco = async () => {
        const result = await Swal.fire({
            title: `Excluir "${contaAtiva.nome}"?`,
            text: "Isso apagará todos os dados permanentemente. Não há volta!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'EXCLUIR TUDO',
            background: '#18181b', color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/configuracoes/espaco/${contaAtiva.id}`);
                window.location.href = '/';
            } catch (e) {
                Swal.fire('Erro', 'Falha ao excluir o espaço.', 'error');
            }
        }
    };

    if (!usuarioLogado) return null

    return (
        <>
            <TopBar
                contaAtiva={contaAtiva}
                membros={usuariosNaConta}
                contasDisponiveis={listaContas}
                usuarioLogado={usuarioLogado}
                abrirCriarConta={() => { }}
                selecionarConta={mudarConta}
            />

            <Container>
                <div className="flex flex-col md:flex-row gap-8 mt-10">
                    <aside className="w-full md:w-64 flex flex-col gap-2">
                        <button
                            onClick={() => setAbaAtiva('perfil')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${abaAtiva === 'perfil' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
                        >
                            <User size={18} /> Meu Perfil
                        </button>
                        <button
                            onClick={() => setAbaAtiva('espaco')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${abaAtiva === 'espaco' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:bg-zinc-800'}`}
                        >
                            <LayoutGrid size={18} /> Configurações do Espaço
                        </button>
                    </aside>

                    <main className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
                        {abaAtiva === 'perfil' && (
                            <form onSubmit={salvarPerfil} className="max-w-xl space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Meu Perfil</h2>
                                    <p className="text-zinc-500 text-sm mb-6">Informações de {usuarioLogado.nome}.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Nome Completo</label>
                                        <input type="text" defaultValue={usuarioLogado.nome} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Iniciais</label>
                                        <input type="text" readOnly value={usuarioLogado.iniciais} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-500 outline-none transition-all text-center" />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-zinc-800 flex justify-end">
                                    <div className="w-full md:w-48">
                                        <Button texto={loading ? "Salvando..." : "Salvar Alterações"} variant="primary" />
                                    </div>
                                </div>
                            </form>
                        )}

                        {abaAtiva === 'espaco' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Configurações de "{contaAtiva?.nome || 'Conta'}"</h2>
                                    <p className="text-zinc-500 text-sm">Gerencie quem tem acesso a este espaço.</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-widest">Membros Ativos</h3>
                                    {usuariosNaConta.map((u: any) => {
                                        const currentId = u.id || u.usuario_id;
                                        return (
                                            <div key={currentId} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-emerald-500">
                                                        {u.nome?.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{u.nome}</p>
                                                        {/* Alterado de leitor para editor */}
                                                        <p className="text-zinc-500 text-xs uppercase">{u.role || u.papel || 'editor'}</p>
                                                    </div>
                                                </div>
                                                {usuarioLogado.id !== currentId && (
                                                    <button
                                                        onClick={() => removerMembro(currentId)}
                                                        className="text-red-500 text-xs font-bold hover:underline"
                                                    >
                                                        Remover
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="pt-10 border-t border-zinc-800">
                                    <h3 className="text-red-500 font-bold text-sm mb-4 uppercase tracking-widest">Zona de Perigo</h3>
                                    <button
                                        onClick={excluirEspaco}
                                        className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors text-sm font-medium"
                                    >
                                        <Trash2 size={16} /> Excluir espaço "{contaAtiva?.nome}"
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </Container>
        </>
    )
}