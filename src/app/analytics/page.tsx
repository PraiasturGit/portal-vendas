"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  ChevronDown,
  Loader2,
  BadgeDollarSign,
  Ticket,
  Calendar,
  List,
  LayoutList,
} from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CardKPI, BadgeStatus } from "@/components/analytics/AnalyticsUI";

export default function AnalyticsPage() {
  const {
    user,
    metricas,
    historicoVendas,
    listaVendedores,
    supervisores,
    loading,
    activeTab,
    setActiveTab,
    filtros,
    setFiltros,
    selectedSupervisor,
    setSelectedSupervisor,
  } = useAnalytics();

  const [modoVisualizacao, setModoVisualizacao] = useState<
    "resumido" | "completo"
  >("resumido");

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const convitesAgrupados = useMemo(() => {
    if (!metricas?.listaDetalhadaConvites) return [];

    const agrupamento: Record<string, any> = {};

    metricas.listaDetalhadaConvites.forEach((convite: any) => {
      const dataObj = new Date(convite.dataCriacao);
      const dataFormatada = dataObj.toLocaleDateString("pt-BR");
      const nomeVendedor = convite.vendedor || "Desconhecido";
      const chave = `${dataFormatada}-${nomeVendedor}`;

      if (!agrupamento[chave]) {
        agrupamento[chave] = {
          dataExibicao: dataFormatada,
          vendedor: nomeVendedor,
          qtd: 0,
          timestamp: dataObj.getTime(),
        };
      }
      agrupamento[chave].qtd += 1;
    });

    return Object.values(agrupamento).sort(
      (a: any, b: any) => b.timestamp - a.timestamp
    );
  }, [metricas?.listaDetalhadaConvites]);
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link
            href="/"
            className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar para Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Analytics de Performance
          </h1>
        </div>

        {/* SELETOR ADMIN */}
        {user?.role === "ADMIN" && (
          <div className="relative">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <Users size={18} className="text-gray-500" />
              <select
                className="bg-transparent font-medium text-blue-600 outline-none cursor-pointer appearance-none pr-6"
                value={selectedSupervisor}
                onChange={(e) => setSelectedSupervisor(e.target.value)}
              >
                <option value="" disabled>
                  Selecione um Supervisor
                </option>
                {supervisores.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.nome}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-4 text-blue-600 pointer-events-none"
              />
            </div>
          </div>
        )}
      </header>

      {/* COMPONENTE DE FILTROS */}
      <AnalyticsFilters
        filtros={filtros}
        setFiltros={setFiltros}
        listaVendedores={listaVendedores}
      />

      {/* NAVEGAÇÃO DE ABAS */}
      <div className="flex gap-6 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("vendas")}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 transition-colors ${
            activeTab === "vendas"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BadgeDollarSign size={18} /> Vendas
        </button>
        <button
          onClick={() => setActiveTab("convites")}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 transition-colors ${
            activeTab === "convites"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Ticket size={18} /> Convites
        </button>
      </div>

      {/* CONTEÚDO */}
      {loading ? (
        <div className="py-20 flex justify-center w-full">
          <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : !metricas ? (
        <div className="text-center py-10 text-gray-400">
          {user?.role === "ADMIN" && !selectedSupervisor
            ? "👆 Selecione um supervisor para visualizar os dados."
            : "Nenhum dado encontrado com os filtros atuais."}
        </div>
      ) : (
        <main className="animate-fade-in">
          {/* ================= ABA DE VENDAS (Idealmente mover para TabVendas.tsx também) ================= */}
          {activeTab === "vendas" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardKPI
                  title="Vendas Totais"
                  value={metricas.vendas?.qtd || 0}
                  subtitle="Contratos fechados"
                  icon={<BadgeDollarSign className="text-blue-600" />}
                  color="blue"
                />
                <CardKPI
                  title="Faturamento"
                  value={formatMoney(metricas.vendas?.total_valor || 0)}
                  subtitle="Total aprovado"
                  icon={<TrendingUp className="text-green-600" />}
                  color="green"
                />
                <CardKPI
                  title="Vendas Hoje"
                  value={metricas.vendas?.qtd_hoje || 0}
                  subtitle="Diário"
                  icon={<Calendar className="text-orange-600" />}
                  color="orange"
                />
              </div>

              {/* TABELA DE VENDAS */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800">
                    Histórico de Vendas
                  </h3>
                  <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {historicoVendas.length} registros
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                      <tr>
                        <th className="p-4">Data</th>
                        <th className="p-4">Contrato</th>
                        <th className="p-4">Vendedor</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Valor</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(historicoVendas) &&
                        historicoVendas.map((venda: any) => (
                          <tr key={venda.id} className="hover:bg-gray-50">
                            <td className="p-4 text-gray-500 font-medium">
                              {new Date(venda.data_venda).toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="p-4 font-medium text-gray-600">
                              {venda.numero_contrato}
                            </td>
                            <td className="p-4 text-blue-600 font-medium">
                              {venda.nome_vendedor}
                            </td>
                            <td className="p-4 text-xs font-bold text-gray-500 uppercase">
                              {venda.tipo_venda || "-"}
                            </td>

                            <td className="p-4 text-green-600 font-bold">
                              {formatMoney(venda.valor_total)}
                            </td>
                            <td className="p-4">
                              <BadgeStatus status={venda.status} />
                            </td>
                          </tr>
                        ))}
                      {(!Array.isArray(historicoVendas) ||
                        historicoVendas.length === 0) && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-8 text-center text-gray-400"
                          >
                            Nenhuma venda encontrada.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= ABA DE CONVITES ================= */}
          {/* Aqui chamamos o componente limpo */}
          {activeTab === "convites" && (
            <div className="space-y-6 animate-fade-in">
              {/* 4. BOTÕES DE ALTERNÂNCIA (TOGGLE) - MANTENHA IGUAL */}
              <div className="flex justify-end gap-2 mb-2">
                <button
                  onClick={() => setModoVisualizacao("resumido")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${
                    modoVisualizacao === "resumido"
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <LayoutList size={14} /> Visão Resumida
                </button>
                <button
                  onClick={() => setModoVisualizacao("completo")}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${
                    modoVisualizacao === "completo"
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <List size={14} /> Histórico Completo
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800">
                    {modoVisualizacao === "resumido"
                      ? "Convites (Consolidado)"
                      : "Histórico Detalhado"}
                  </h3>

                  {/* --- MUDANÇA 1: BADGE COM TOTAL ENTREGUE --- */}
                  <span className="text-xs font-medium bg-purple-100 px-2 py-1 rounded text-purple-600">
                    {modoVisualizacao === "resumido"
                      ? `${
                          metricas.listaDetalhadaConvites?.length || 0
                        } entregues (em ${convitesAgrupados.length} grupos)`
                      : `${
                          metricas.listaDetalhadaConvites?.length || 0
                        } registros totais`}
                  </span>
                  {/* ------------------------------------------- */}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                      <tr>
                        {modoVisualizacao === "resumido" ? (
                          <>
                            <th className="p-4">Data</th>
                            <th className="p-4">Vendedor</th>

                            {/* --- MUDANÇA 2: TÍTULO DA COLUNA --- */}
                            <th className="p-4 text-center">Total Entregue</th>
                            {/* ----------------------------------- */}

                            <th className="p-4 text-right">Visão</th>
                          </>
                        ) : (
                          <>
                            <th className="p-4">Hora/Data</th>
                            <th className="p-4">Vendedor</th>
                            <th className="p-4 text-right">Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* O CORPO DA TABELA PODE FICAR IGUAL AO QUE JÁ ESTAVA */}
                      {modoVisualizacao === "resumido" &&
                        convitesAgrupados.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-4 text-gray-500 font-medium">
                              {item.dataExibicao}
                            </td>
                            <td className="p-4 text-purple-600 font-bold">
                              {item.vendedor}
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold">
                                {item.qtd}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 uppercase">
                                AGRUPADO
                              </span>
                            </td>
                          </tr>
                        ))}

                      {modoVisualizacao === "completo" &&
                        metricas.listaDetalhadaConvites?.map(
                          (convite: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-4 text-gray-500">
                                {new Date(convite.dataCriacao).toLocaleString(
                                  "pt-BR"
                                )}
                              </td>
                              <td className="p-4 text-purple-600 font-medium">
                                {convite.vendedor}
                              </td>
                              <td className="p-4 text-right">
                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">
                                  ENTREGUE
                                </span>
                              </td>
                            </tr>
                          )
                        )}

                      {/* MENSAGEM DE VAZIO */}
                      {((modoVisualizacao === "resumido" &&
                        convitesAgrupados.length === 0) ||
                        (modoVisualizacao === "completo" &&
                          (!metricas.listaDetalhadaConvites ||
                            metricas.listaDetalhadaConvites.length === 0))) && (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-8 text-center text-gray-400"
                          >
                            Nenhum convite encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
