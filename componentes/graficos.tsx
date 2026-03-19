'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

type GraficosProps = {
    data: {
        name: string;
        value: number;
        color: string;
    }[]
}

export default function Graficos({ data }: GraficosProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 shadow-xl">
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
                    Distribuição de Gastos
                </h3>
                <div className="h-50 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: '#09090b',
                                    border: '1px solid #27272a',
                                    borderRadius: '12px',
                                }}
                                itemStyle={{ color: '#f4f4f5' }}
                                formatter={(value: any) =>
                                    new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(Number(value))
                                }
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Card Lateral para Legenda ou Info extra */}
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 shadow-xl flex flex-col justify-center">
                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Legenda</h3>
                <div className="space-y-3">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-zinc-300 text-sm">{item.name}</span>
                            </div>
                            <span className="text-zinc-500 text-sm font-mono">
                                {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}