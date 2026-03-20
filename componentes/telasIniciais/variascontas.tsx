import Container from "../container";

type ContasType = {
    id: number,
    nome: string,
    criado_por: number,
    criado_em: Date,
    ativo: boolean,
    papel: string,
    role: '' | 'editor' | 'admin'
}

type ContasProps = {
    listaContas: ContasType[];
    selecionar: (id: number) => void;
}

export default function VariasContas({ listaContas, selecionar }: ContasProps) {

    return (
        <>
            <Container>
                <div className="py-20 text-center">
                    <h1 className="text-2xl font-bold mb-8">Selecione um Espaço</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {listaContas.map(conta => (
                            <div
                                key={conta.id}
                                onClick={() => {
                                    selecionar(conta.id)
                                    localStorage.setItem('contaAtivaId', String(conta.id));
                                    window.location.reload();
                                }}
                                className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:border-emerald-500 transition-all"
                            >
                                <h3 className="text-lg font-medium">{conta.nome}</h3>
                                <p className="text-zinc-500 text-sm"> {conta.papel == 'adm' ? 'Proprietário' : 'Convidado'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </>
    )
}