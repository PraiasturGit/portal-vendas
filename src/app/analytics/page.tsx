"use client";

import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  Download,
  Percent,
  BarChart3,
  Trophy,
} from "lucide-react";

import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { CardKPI, BadgeStatus } from "@/components/analytics/AnalyticsUI";

type MesLinha = {
  chave: string;
  label: string;
  vendas: number;
  convites: number;
  valor: number;
};

type TopVendedor = {
  vendedor: string;
  vendas: number;
  valor: number;
};

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
    }).format(Number(val || 0));

  const vendedorFiltroAtivo = useMemo(() => {
    const raw =
      (filtros as any)?.nomeVendedor ||
      (filtros as any)?.nome_vendedor ||
      (filtros as any)?.id_vendedor_filtro ||
      (filtros as any)?.vendedor ||
      "";
    return String(raw || "").trim();
  }, [filtros]);

  const historicoVendasTodos = Array.isArray(historicoVendas)
    ? historicoVendas
    : [];

  const listaConvitesTodos = Array.isArray(metricas?.listaDetalhadaConvites)
    ? metricas.listaDetalhadaConvites
    : [];

  const historicoVendasFiltrado = useMemo(() => {
    if (
      !vendedorFiltroAtivo ||
      vendedorFiltroAtivo === "TODOS" ||
      vendedorFiltroAtivo === "Todos"
    ) {
      return historicoVendasTodos;
    }

    return historicoVendasTodos.filter((v: any) => {
      const nome = String(v?.nome_vendedor || "").trim();
      const id = String(v?.id_vendedor || "").trim();
      return nome === vendedorFiltroAtivo || id === vendedorFiltroAtivo;
    });
  }, [historicoVendasTodos, vendedorFiltroAtivo]);

  const listaConvitesFiltrada = useMemo(() => {
    if (
      !vendedorFiltroAtivo ||
      vendedorFiltroAtivo === "TODOS" ||
      vendedorFiltroAtivo === "Todos"
    ) {
      return listaConvitesTodos;
    }

    return listaConvitesTodos.filter((c: any) => {
      const nome = String(c?.vendedor || "").trim();
      const id = String(c?.id_vendedor || "").trim();
      return nome === vendedorFiltroAtivo || id === vendedorFiltroAtivo;
    });
  }, [listaConvitesTodos, vendedorFiltroAtivo]);

  const totalVendas = historicoVendasFiltrado.length;
  const totalConvites = listaConvitesFiltrada.length;
  const valorTotalVendido = historicoVendasFiltrado.reduce(
    (acc: number, item: any) => acc + Number(item?.valor_total || 0),
    0
  );

  const taxaConversaoNumero =
    totalConvites > 0 ? (totalVendas / totalConvites) * 100 : 0;

  const taxaConversao = `${taxaConversaoNumero.toFixed(1)}%`;
  const leituraConversao =
    totalConvites > 0 && totalVendas > 0
      ? `a cada ${Math.max(1, Math.round(totalConvites / totalVendas))} convites vende 1`
      : "sem conversão no período";

  const convitesAgrupados = useMemo(() => {
    if (!listaConvitesFiltrada.length) return [];

    const agrupamento: Record<string, any> = {};

    listaConvitesFiltrada.forEach((convite: any) => {
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
  }, [listaConvitesFiltrada]);

  const mensalVendasConvites: MesLinha[] =
    metricas?.vendasConvitesMensal3Meses || [];

  const maxMensal = useMemo(() => {
    return Math.max(
      1,
      ...mensalVendasConvites.flatMap((m) => [m.vendas, m.convites])
    );
  }, [mensalVendasConvites]);

  const topVendedoresPorValor = useMemo<TopVendedor[]>(() => {
    const mapa: Record<string, TopVendedor> = {};

    historicoVendasTodos.forEach((v: any) => {
      const nome = String(v?.nome_vendedor || "Desconhecido").trim();

      if (!mapa[nome]) {
        mapa[nome] = {
          vendedor: nome,
          vendas: 0,
          valor: 0,
        };
      }

      mapa[nome].vendas += 1;
      mapa[nome].valor += Number(v?.valor_total || 0);
    });

    return Object.values(mapa)
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10);
  }, [historicoVendasTodos]);

  const maxTopValor = useMemo(() => {
    return Math.max(1, ...topVendedoresPorValor.map((i) => i.valor));
  }, [topVendedoresPorValor]);

  const mixedChartMeta = useMemo(() => {
    if (!mensalVendasConvites.length) {
      return {
        convitesBars: [] as Array<{
          x: number;
          y: number;
          width: number;
          height: number;
          valor: number;
          label: string;
        }>,
        vendasDots: [] as Array<{
          x: number;
          y: number;
          valor: number;
          label: string;
        }>,
        vendasLine: "",
        monthGuides: [] as Array<{ x: number; label: string }>,
      };
    }

    const width = 100;
    const height = 100;
    const paddingX = 10;
    const paddingY = 10;
    const baseY = height - paddingY;
    const stepX =
      mensalVendasConvites.length > 1
        ? (width - paddingX * 2) / (mensalVendasConvites.length - 1)
        : 0;

    const toY = (valor: number) => {
      const usableHeight = height - paddingY * 2;
      return height - paddingY - (valor / maxMensal) * usableHeight;
    };

    const barWidth = Math.min(14, stepX * 0.42);

    const convitesBars = mensalVendasConvites.map((item, idx) => {
      const centerX = paddingX + idx * stepX;
      const y = toY(item.convites);
      return {
        x: centerX - barWidth / 2,
        y,
        width: barWidth,
        height: baseY - y,
        valor: item.convites,
        label: item.label,
      };
    });

    const vendasDots = mensalVendasConvites.map((item, idx) => ({
      x: paddingX + idx * stepX,
      y: toY(item.vendas),
      valor: item.vendas,
      label: item.label,
    }));

    const vendasLine = vendasDots.map((p) => `${p.x},${p.y}`).join(" ");

    const monthGuides = mensalVendasConvites.map((item, idx) => ({
      x: paddingX + idx * stepX,
      label: item.label,
    }));

    return {
      convitesBars,
      vendasDots,
      vendasLine,
      monthGuides,
    };
  }, [mensalVendasConvites, maxMensal]);

  const handleExportPDF = () => {
    const supervisorEncontrado = supervisores.find(
      (s) => String(s.id) === String(selectedSupervisor)
    );
    const nomeSupervisor = supervisorEncontrado?.nome || "Geral";
    const nomeArquivoSafe = nomeSupervisor.replace(/[^a-zA-Z0-9]/g, "_");
    const dataHoje = new Date().toISOString().split("T")[0];
    const dataInicio = filtros?.data_inicial
      ? new Date(filtros.data_inicial).toLocaleDateString("pt-BR")
      : "Início";
    const dataFim = filtros?.data_final
      ? new Date(filtros.data_final).toLocaleDateString("pt-BR")
      : "Hoje";

    const doc = new jsPDF();
    let cursorY = 20;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Portal de Vendas - PRAIASTUR", 14, cursorY);
    cursorY += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 14, cursorY);
    cursorY += 10;

    if (selectedSupervisor) {
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(`Supervisor: ${nomeSupervisor}`, 14, cursorY);
      cursorY += 8;
    }

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(`Período: ${dataInicio} até ${dataFim}`, 14, cursorY);
    cursorY += 8;

    if (
      vendedorFiltroAtivo &&
      vendedorFiltroAtivo !== "TODOS" &&
      vendedorFiltroAtivo !== "Todos"
    ) {
      doc.text(`Vendedor: ${vendedorFiltroAtivo}`, 14, cursorY);
      cursorY += 8;
    }

    if (activeTab === "vendas") {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Relatório de Vendas", 14, cursorY);
      cursorY += 6;

      const tableData = historicoVendasFiltrado.map((venda: any) => [
        new Date(venda.data_venda).toLocaleDateString("pt-BR"),
        venda.numero_contrato,
        venda.nome_vendedor,
        venda.tipo_venda || "-",
        formatMoney(venda.valor_total),
        venda.status,
      ]);

      autoTable(doc, {
        startY: cursorY,
        head: [["Data", "Contrato", "Vendedor", "Tipo", "Valor", "Status"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.text(`Total de Vendas: ${totalVendas}`, 14, finalY);
      doc.text(
        `Valor Vendido: ${formatMoney(valorTotalVendido)}`,
        14,
        finalY + 6
      );

      doc.save(`Vendas_${nomeArquivoSafe}_${dataHoje}.pdf`);
    } else if (activeTab === "convites") {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const titulo =
        modoVisualizacao === "resumido"
          ? "Relatório de Convites (Consolidado)"
          : "Relatório de Convites (Detalhado)";
      doc.text(titulo, 14, cursorY);
      cursorY += 8;

      const totalPorVendedor: Record<string, number> = {};
      const totalGeral = listaConvitesFiltrada.length;

      listaConvitesFiltrada.forEach((convite: any) => {
        const vendedor = convite.vendedor || "Indefinido";
        totalPorVendedor[vendedor] = (totalPorVendedor[vendedor] || 0) + 1;
      });

      const dadosResumo = Object.entries(totalPorVendedor)
        .map(([nome, qtd]) => [nome, qtd])
        .sort((a, b) => (b[1] as number) - (a[1] as number));

      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text("Resumo por Vendedor (Ranking)", 14, cursorY);
      cursorY += 4;

      autoTable(doc, {
        startY: cursorY,
        head: [["Vendedor", "Total Entregue"]],
        body: dadosResumo,
        theme: "striped",
        headStyles: { fillColor: [60, 60, 60] },
        columnStyles: {
          0: { cellWidth: "auto" },
          1: { cellWidth: 40, halign: "center", fontStyle: "bold" },
        },
        styles: { fontSize: 10 },
      });

      let currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.setDrawColor(220, 220, 220);
      doc.line(14, currentY - 4, 100, currentY - 4);
      doc.text(`TOTAL GERAL NO PERÍODO: ${totalGeral}`, 14, currentY + 2);

      currentY += 15;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text("Detalhamento do Período", 14, currentY);

      let head: string[][] = [];
      let body: any[] = [];

      if (modoVisualizacao === "resumido") {
        head = [["Data", "Vendedor", "Qtd Entregue"]];
        body = convitesAgrupados.map((item: any) => [
          item.dataExibicao,
          item.vendedor,
          item.qtd,
        ]);
      } else {
        head = [["Data/Hora", "Vendedor", "Evento", "Status"]];
        body =
          listaConvitesFiltrada.map((convite: any) => [
            new Date(convite.dataCriacao).toLocaleString("pt-BR"),
            convite.vendedor,
            convite.evento || "-",
            "ENTREGUE",
          ]) || [];
      }

      autoTable(doc, {
        startY: currentY + 5,
        head,
        body,
        theme: "grid",
        headStyles: { fillColor: [147, 51, 234] },
        styles: { fontSize: 9 },
      });

      doc.save(`Convites_${nomeArquivoSafe}_${dataHoje}.pdf`);
    } else if (activeTab === "vendas-convites") {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Relatório de Vendas x Convites", 14, cursorY);
      cursorY += 8;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Convites Entregues: ${totalConvites}`, 14, cursorY);
      cursorY += 6;
      doc.text(`Vendas: ${totalVendas}`, 14, cursorY);
      cursorY += 6;
      doc.text(`Valor Vendido: ${formatMoney(valorTotalVendido)}`, 14, cursorY);
      cursorY += 6;
      doc.text(`Taxa de Conversão: ${taxaConversao}`, 14, cursorY);
      cursorY += 6;
      doc.text(`Leitura: ${leituraConversao}`, 14, cursorY);
      cursorY += 10;

      autoTable(doc, {
        startY: cursorY,
        head: [["Mês", "Convites", "Vendas", "Valor Vendido"]],
        body: mensalVendasConvites.map((item) => [
          item.label,
          item.convites,
          item.vendas,
          formatMoney(item.valor),
        ]),
        theme: "grid",
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 9 },
      });

      let finalY = (doc as any).lastAutoTable.finalY + 10;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Top Vendedores por Valor Vendido", 14, finalY);
      finalY += 4;

      autoTable(doc, {
        startY: finalY,
        head: [["Vendedor", "Vendas", "Valor Vendido"]],
        body: topVendedoresPorValor.map((item) => [
          item.vendedor,
          item.vendas,
          formatMoney(item.valor),
        ]),
        theme: "grid",
        headStyles: { fillColor: [245, 158, 11] },
        styles: { fontSize: 9 },
      });

      doc.save(`Vendas_x_Convites_${nomeArquivoSafe}_${dataHoje}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800 md:p-8">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link
            href="/"
            className="mb-2 flex items-center text-sm text-gray-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar para Home
          </Link>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900">
            <TrendingUp className="text-blue-600" /> Analytics de Performance
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={loading || !metricas}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Exportar PDF
          </button>

          {user?.role === "ADMIN" && (
            <div className="relative">
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
                <Users size={18} className="text-gray-500" />
                <select
                  className="cursor-pointer appearance-none bg-transparent pr-6 font-medium text-blue-600 outline-none"
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
                  className="pointer-events-none absolute right-4 text-blue-600"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <AnalyticsFilters
        filtros={filtros}
        setFiltros={setFiltros}
        listaVendedores={listaVendedores}
      />

      <div className="mb-8 flex gap-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("vendas")}
          className={`flex items-center gap-2 px-1 pb-3 text-sm font-bold transition-colors ${
            activeTab === "vendas"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BadgeDollarSign size={18} /> Vendas
        </button>

        <button
          onClick={() => setActiveTab("convites")}
          className={`flex items-center gap-2 px-1 pb-3 text-sm font-bold transition-colors ${
            activeTab === "convites"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Ticket size={18} /> Convites
        </button>

        <button
          onClick={() => setActiveTab("vendas-convites")}
          className={`flex items-center gap-2 px-1 pb-3 text-sm font-bold transition-colors ${
            activeTab === "vendas-convites"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Percent size={18} /> Vendas x Convites
        </button>
      </div>

      {loading ? (
        <div className="flex w-full justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        </div>
      ) : !metricas ? (
        <div className="py-10 text-center text-gray-400">
          {user?.role === "ADMIN" && !selectedSupervisor
            ? "👆 Selecione um supervisor para visualizar os dados."
            : "Nenhum dado encontrado com os filtros atuais."}
        </div>
      ) : (
        <main className="animate-fade-in">
          {activeTab === "vendas" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-50 p-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Histórico de Vendas
                  </h3>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {historicoVendas.length} registros
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 font-semibold uppercase text-gray-500">
                      <tr>
                        <th className="p-4">Data</th>
                        <th className="p-4">Contrato</th>
                        <th className="p-4">Vendedor</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Valor</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Evento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Array.isArray(historicoVendas) &&
                        historicoVendas.map((venda: any) => (
                          <tr key={venda.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-500">
                              {new Date(venda.data_venda).toLocaleDateString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="p-4 font-medium text-gray-600">
                              {venda.numero_contrato}
                            </td>
                            <td className="p-4 font-medium text-blue-600">
                              {venda.nome_vendedor}
                            </td>
                            <td className="p-4 text-xs font-bold uppercase text-gray-500">
                              {venda.tipo_venda || "-"}
                            </td>
                            <td className="p-4 font-bold text-green-600">
                              {formatMoney(venda.valor_total)}
                            </td>
                            <td className="p-4">
                              <BadgeStatus status={venda.status} />
                            </td>
                            <td className="p-4 text-xs font-bold uppercase text-gray-600">
                              {venda.evento || "-"}
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

          {activeTab === "convites" && (
            <div className="animate-fade-in space-y-6">
              <div className="mb-2 flex justify-end gap-2">
                <button
                  onClick={() => setModoVisualizacao("resumido")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    modoVisualizacao === "resumido"
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <LayoutList size={14} /> Visão Resumida
                </button>
                <button
                  onClick={() => setModoVisualizacao("completo")}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    modoVisualizacao === "completo"
                      ? "bg-purple-100 text-purple-700 shadow-sm"
                      : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <List size={14} /> Histórico Completo
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-50 p-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    {modoVisualizacao === "resumido"
                      ? "Convites (Consolidado)"
                      : "Histórico Detalhado"}
                  </h3>

                  <span className="rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-600">
                    {modoVisualizacao === "resumido"
                      ? `${
                          listaConvitesFiltrada.length || 0
                        } entregues (em ${convitesAgrupados.length} grupos)`
                      : `${
                          listaConvitesFiltrada.length || 0
                        } registros totais`}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 font-semibold uppercase text-gray-500">
                      <tr>
                        {modoVisualizacao === "resumido" ? (
                          <>
                            <th className="p-4">Data</th>
                            <th className="p-4">Vendedor</th>
                            <th className="p-4 text-center">Total Entregue</th>
                            <th className="p-4 text-right">Visão</th>
                          </>
                        ) : (
                          <>
                            <th className="p-4">Hora/Data</th>
                            <th className="p-4">Vendedor</th>
                            <th className="p-4">Evento</th>
                            <th className="p-4 text-right">Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {modoVisualizacao === "resumido" &&
                        convitesAgrupados.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-500">
                              {item.dataExibicao}
                            </td>
                            <td className="p-4 font-bold text-purple-600">
                              {item.vendedor}
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-700">
                                {item.qtd}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-600">
                                AGRUPADO
                              </span>
                            </td>
                          </tr>
                        ))}

                      {modoVisualizacao === "completo" &&
                        listaConvitesFiltrada.map((convite: any, idx: number) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-4 text-gray-500">
                              {new Date(convite.dataCriacao).toLocaleString(
                                "pt-BR"
                              )}
                            </td>
                            <td className="p-4 font-medium text-purple-600">
                              {convite.vendedor}
                            </td>
                            <td className="p-4 text-gray-700">
                              {convite.evento || "-"}
                            </td>
                            <td className="p-4 text-right">
                              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase text-blue-600">
                                ENTREGUE
                              </span>
                            </td>
                          </tr>
                        ))}

                      {((modoVisualizacao === "resumido" &&
                        convitesAgrupados.length === 0) ||
                        (modoVisualizacao === "completo" &&
                          (!listaConvitesFiltrada ||
                            listaConvitesFiltrada.length === 0))) && (
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

          {activeTab === "vendas-convites" && (
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <CardKPI
                  title="Convites Entregues"
                  value={totalConvites}
                  subtitle="Total no período"
                  icon={<Ticket className="text-purple-600" />}
                  color="purple"
                />
                <CardKPI
                  title="Vendas"
                  value={totalVendas}
                  subtitle="Total no período"
                  icon={<BadgeDollarSign className="text-blue-600" />}
                  color="blue"
                />
                <CardKPI
                  title="Valor Vendido"
                  value={formatMoney(valorTotalVendido)}
                  subtitle="Faturamento do período"
                  icon={<TrendingUp className="text-green-600" />}
                  color="green"
                />
                <CardKPI
                  title="Taxa de Conversão"
                  value={taxaConversao}
                  subtitle={leituraConversao}
                  icon={<Percent className="text-orange-600" />}
                  color="orange"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="text-blue-600" size={20} />
                        <h3 className="text-lg font-bold text-gray-800">
                          Mensal de Vendas x Convites
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Barras para convites entregues e linha para vendas.
                      </p>
                    </div>

                    <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      Últimos 3 meses
                    </div>
                  </div>

                  {mensalVendasConvites.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-400">
                      Nenhum dado mensal encontrado.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-5">
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-2 text-purple-600">
                              <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-500" />
                              Convites entregues
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
                              Vendas
                            </div>
                          </div>

                          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                            Pico da escala: {maxMensal}
                          </div>
                        </div>

                        <div className="grid grid-cols-[42px_1fr] gap-3">
                          <div className="flex h-72 flex-col justify-between pb-8 text-[11px] font-medium text-gray-400">
                            <div>{maxMensal}</div>
                            <div>{Math.round(maxMensal * 0.66)}</div>
                            <div>{Math.round(maxMensal * 0.33)}</div>
                            <div>0</div>
                          </div>

                          <div className="relative h-72 w-full">
                            <svg
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              className="h-full w-full"
                            >
                              <defs>
                                <linearGradient
                                  id="purpleBarsGradient"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#8b5cf6"
                                    stopOpacity="0.95"
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#a78bfa"
                                    stopOpacity="0.78"
                                  />
                                </linearGradient>

                                <filter
                                  id="purpleBarShadow"
                                  x="-20%"
                                  y="-20%"
                                  width="140%"
                                  height="160%"
                                >
                                  <feDropShadow
                                    dx="0"
                                    dy="1.2"
                                    stdDeviation="1.4"
                                    floodColor="#8b5cf6"
                                    floodOpacity="0.18"
                                  />
                                </filter>
                              </defs>

                              {[20, 40, 60, 80].map((y) => (
                                <line
                                  key={y}
                                  x1="8"
                                  y1={y}
                                  x2="92"
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="0.6"
                                  strokeDasharray="2 2"
                                />
                              ))}

                              {mixedChartMeta.monthGuides.map((guide, idx) => (
                                <line
                                  key={idx}
                                  x1={guide.x}
                                  y1="10"
                                  x2={guide.x}
                                  y2="90"
                                  stroke="#f3f4f6"
                                  strokeWidth="0.45"
                                />
                              ))}

                              {mixedChartMeta.convitesBars.map((bar, idx) => (
                                <rect
                                  key={`bar-${idx}`}
                                  x={bar.x}
                                  y={bar.y}
                                  width={bar.width}
                                  height={bar.height}
                                  rx="2.4"
                                  fill="url(#purpleBarsGradient)"
                                  filter="url(#purpleBarShadow)"
                                />
                              ))}

                              <polyline
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                points={mixedChartMeta.vendasLine}
                              />

                              {mixedChartMeta.vendasDots.map((point, idx) => (
                                <g key={`venda-${idx}`}>
                                  <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="2.7"
                                    fill="#3b82f6"
                                    stroke="white"
                                    strokeWidth="1.1"
                                  />
                                </g>
                              ))}
                            </svg>

                            <div className="mt-4 grid grid-cols-3 text-center text-xs font-semibold text-gray-500">
                              {mensalVendasConvites.map((item) => (
                                <div key={item.chave}>{item.label}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {mensalVendasConvites.map((item) => {
                          const conversaoMes =
                            item.convites > 0
                              ? ((item.vendas / item.convites) * 100).toFixed(
                                  1
                                )
                              : "0.0";

                          return (
                            <div
                              key={item.chave}
                              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                            >
                              <div className="mb-3 flex items-center justify-between">
                                <div className="text-sm font-bold text-gray-800">
                                  {item.label}
                                </div>
                                <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                                  {conversaoMes}%
                                </span>
                              </div>

                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center justify-between">
                                  <span>Convites</span>
                                  <span className="font-bold text-purple-600">
                                    {item.convites}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Vendas</span>
                                  <span className="font-bold text-blue-600">
                                    {item.vendas}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Valor</span>
                                  <span className="font-bold text-green-600">
                                    {formatMoney(item.valor)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} />
                    <h3 className="text-lg font-bold text-gray-800">
                      Top Vendedores por Valor Vendido
                    </h3>
                  </div>

                  <div className="mb-3 text-xs text-gray-500">
                    Este ranking não é afetado pelo filtro de vendedor.
                  </div>

                  {topVendedoresPorValor.length === 0 ? (
                    <div className="py-8 text-center text-sm text-gray-400">
                      Nenhum vendedor encontrado.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topVendedoresPorValor.map((item, idx) => (
                        <div key={`${item.vendedor}-${idx}`}>
                          <div className="mb-1.5 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold text-gray-800">
                                {idx + 1}. {item.vendedor}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.vendas} venda(s)
                              </div>
                            </div>
                            <div className="whitespace-nowrap text-sm font-bold text-green-600">
                              {formatMoney(item.valor)}
                            </div>
                          </div>

                          <div className="h-2.5 rounded-full bg-gray-100">
                            <div
                              className="h-2.5 rounded-full bg-green-500"
                              style={{
                                width: `${(item.valor / maxTopValor) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
