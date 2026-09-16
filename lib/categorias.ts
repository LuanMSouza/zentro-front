export const CATEGORIAS_DESPESA = [
    "Alimentação", "Moradia", "Transporte", "Saúde", "Educação",
    "Lazer", "Assinaturas", "Compras", "Pets", "Outros"
] as const;

export const CATEGORIAS_RECEITA = [
    "Salário", "Freelance", "Investimentos", "Presente", "Reembolso", "Outros"
] as const;

export function categoriasPorTipo(tipo: 'receita' | 'despesa'): readonly string[] {
    return tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;
}
