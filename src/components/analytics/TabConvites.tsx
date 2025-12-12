import { Users, TrendingUp, Ticket, Calendar } from "lucide-react";
import { CardKPI } from "@/components/analytics/AnalyticsUI";

interface TabConvitesProps {
  metricas: any;
  formatMoney: (val: number) => string;
}

export function TabConvites({ metricas, formatMoney }: TabConvitesProps) {
  // 1. SEPARAÇÃO: Criamos uma lista específica para essa aba, ordenada por CONVITES
  // O slice() cria uma cópia para não alterar o original
  const rankingConvites = metricas.ranking
    ? metricas.ranking.slice().sort((a: any, b: any) => b.convites - a.convites) // Ordena do maior para o menor convite
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* BLOCO 1: KPIs mantidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardKPI
          title="Total de Convites"
          value={metricas.convites?.total || 0}
          subtitle="No período selecionado"
          icon={<Ticket className="text-purple-600" />}
          color="purple"
        />
        <CardKPI
          title="Convites Hoje"
          value={metricas.convites?.hoje || 0}
          subtitle="Cadastrados hoje"
          icon={<Calendar className="text-pink-600" />}
          color="pink"
        />
      </div>

      {/* BLOCO 2: RANKING E GRÁFICO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2.1 RANKING (Agora ordenado só por convites) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Users size={18} className="text-gray-500" />
            Ranking de Convites
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold text-xs">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Vendedor</th>
                  {/* Se quiser separar TOTALMENTE, pode até remover a coluna Vendas aqui */}
                  <th className="p-3 text-center text-gray-400">Vendas</th>
                  <th className="p-3 text-center text-purple-600 bg-purple-50 rounded-t-lg">
                    Convites
                  </th>
                  {/* Faturamento fica apenas como informativo secundário */}
                  <th className="p-3 text-right text-gray-400">Faturamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rankingConvites.map((vendedor: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-bold text-gray-400 w-10">
                      {index + 1}º
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {vendedor.nome_completo}
                    </td>
                    <td className="p-3 text-center text-gray-400">
                      {vendedor.vendas}
                    </td>
                    {/* A Estrela do show nesta aba é essa coluna: */}
                    <td className="p-3 text-center font-bold text-purple-600 bg-purple-50/50 text-lg">
                      {vendedor.convites}
                    </td>
                    <td className="p-3 text-right text-gray-400">
                      {formatMoney(vendedor.faturamento)}
                    </td>
                  </tr>
                ))}
                {rankingConvites.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      Nenhum convite registrado neste período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2.2 MANTER O GRÁFICO (Se quiser remover vendas daqui também, me avisa) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {/* ... mantém o gráfico ou substitui por gráfico de convites futuro ... */}
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-500" />
            Performance Financeira
          </h3>
          <div className="space-y-4">
            {/* O Gráfico continua mostrando dinheiro, pois convite não tem "valor" monetário direto ainda */}
            {metricas.grafico?.map((dia: any, idx: number) => (
              // ... código do gráfico ...
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                {/* ... conteúdo do gráfico ... */}
                <span className="text-gray-500 w-10">{dia.data_formatada}</span>
                <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        (dia.valor / (metricas.vendas?.total_valor || 1)) *
                          100 *
                          5,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className="font-bold text-gray-700 text-xs">
                  {formatMoney(dia.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
