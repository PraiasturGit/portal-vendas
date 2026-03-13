import React from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";

/* =========================================================================
   BASE DE PROGRESSÃO
======================================================================== */

const ENTRADA_PADRAO_OURO = 880;

/* =========================================================================
   TABELA OURO
======================================================================== */
const TABELA_OURO = [
  { p: 1, parcela: 4200.0, totalPlano: 5080.0 },
  { p: 2, parcela: 2160.0, totalPlano: 5200.0 },
  { p: 3, parcela: 1475.0, totalPlano: 5305.0 },
  { p: 4, parcela: 1120.0, totalPlano: 5360.0 },
  { p: 5, parcela: 908.0, totalPlano: 5420.0 },
  { p: 6, parcela: 760.0, totalPlano: 5440.0 },
  { p: 7, parcela: 655.0, totalPlano: 5465.0 },
  { p: 8, parcela: 575.0, totalPlano: 5480.0 },
  { p: 9, parcela: 515.0, totalPlano: 5515.0 },
  { p: 10, parcela: 465.0, totalPlano: 5530.0 },
  { p: 11, parcela: 425.0, totalPlano: 5555.0 },
  { p: 12, parcela: 392.0, totalPlano: 5584.0 },
  { p: 13, parcela: 365.0, totalPlano: 5625.0 },
  { p: 14, parcela: 340.0, totalPlano: 5640.0 },
  { p: 15, parcela: 318.0, totalPlano: 5650.0 },
  { p: 16, parcela: 300.0, totalPlano: 5680.0 },
  { p: 17, parcela: 285.0, totalPlano: 5725.0 },
  { p: 18, parcela: 270.0, totalPlano: 5740.0 },
  { p: 19, parcela: 260.0, totalPlano: 5820.0 },
  { p: 20, parcela: 250.0, totalPlano: 5880.0 },
  { p: 21, parcela: 240.0, totalPlano: 5920.0 },
  { p: 22, parcela: 230.0, totalPlano: 5940.0 },
  { p: 23, parcela: 222.0, totalPlano: 5986.0 },
  { p: 24, parcela: 215.0, totalPlano: 6040.0 },
];

/* =========================================================================
   DIAMANTE
======================================================================== */
const ENTRADA_PADRAO_DIAMANTE = 1100;
const FATURADO_BASE_DIAMANTE = 5680;
const TOTAL_BASE_DIAMANTE = 6780;

/* =========================================================================
   BRONZE
======================================================================== */
const ENTRADA_PADRAO_BRONZE = 498;
const FATURADO_BASE_BRONZE = 2500;
const TOTAL_BASE_BRONZE = 2998;

/* =========================================================================
   PRATA
======================================================================== */
const ENTRADA_PADRAO_PRATA = 680;

const TABELA_PRATA_2025 = [
  { p: 1, v: 3400.0 },
  { p: 2, v: 1710.0 },
  { p: 3, v: 1150.0 },
  { p: 4, v: 875.0 },
  { p: 5, v: 708.0 },
  { p: 6, v: 600.0 },
  { p: 7, v: 520.0 },
  { p: 8, v: 460.0 },
  { p: 9, v: 410.0 },
  { p: 10, v: 374.0 },
  { p: 11, v: 345.0 },
  { p: 12, v: 320.0 },
  { p: 13, v: 310.0 },
  { p: 14, v: 300.0 },
  { p: 15, v: 290.0 },
  { p: 16, v: 280.0 },
  { p: 17, v: 270.0 },
  { p: 18, v: 260.0 },
  { p: 19, v: 255.0 },
  { p: 20, v: 245.0 },
  { p: 21, v: 235.0 },
  { p: 22, v: 225.0 },
  { p: 23, v: 215.0 },
  { p: 24, v: 200.0 },
];

type TabelaItem = {
  p: number;
  parcela: number;
  totalPlano: number;
};

function gerarTabelaPelaProgressaoDoOuro(
  totalBasePlano: number,
  entradaPadraoPlano: number
): TabelaItem[] {
  const totalBaseOuro = TABELA_OURO[0].totalPlano;

  return TABELA_OURO.map((item) => {
    const fatorPercentual = item.totalPlano / totalBaseOuro;
    const totalPlano = Number((totalBasePlano * fatorPercentual).toFixed(2));
    const parcela = Number(
      ((totalPlano - entradaPadraoPlano) / item.p).toFixed(2)
    );

    return {
      p: item.p,
      parcela,
      totalPlano,
    };
  });
}

const TABELA_DIAMANTE = gerarTabelaPelaProgressaoDoOuro(
  TOTAL_BASE_DIAMANTE,
  ENTRADA_PADRAO_DIAMANTE
);

const TABELA_BRONZE = gerarTabelaPelaProgressaoDoOuro(
  TOTAL_BASE_BRONZE,
  ENTRADA_PADRAO_BRONZE
);

const TABELA_PRATA = TABELA_PRATA_2025.map((item) => ({
  p: item.p,
  parcela: item.v,
  totalPlano: Number((item.p * item.v).toFixed(2)),
}));

const TOTAL_BASE_PRATA = TABELA_PRATA[0]?.totalPlano || 3400;

/* =========================================================================
   OPÇÕES
======================================================================== */
const OPCOES_ENTRADA = [
  { label: "Pix", value: "Pix" },
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Cartão de Crédito", value: "Cartão de Crédito" },
  { label: "Cartão de Débito", value: "Cartão de Débito" },
  { label: "Boleto", value: "Boleto" },
  { label: "Cheque", value: "Cheque" },
  {
    label: "Cartão de Crédito + Dinheiro",
    value: "Cartão de Crédito + Dinheiro",
  },
  {
    label: "Cartão de Crédito + Cartão de Débito",
    value: "Cartão de Débito + Crédito",
  },
  { label: "Cartão de Débito + Pix", value: "Cartão de Débito + Pix" },
  { label: "Cartão de Crédito + Pix", value: "Cartão de Crédito + Pix" },
  { label: "Pix + Dinheiro", value: "Pix + Dinheiro" },
];

const OPCOES_PLANO = [
  { label: "Pix", value: "PIX" },
  { label: "Cartão de Crédito", value: "Cartão de Crédito" },
  { label: "Boleto", value: "Boleto" },
  { label: "Cartão de Débito", value: "Cartão de Débito" },
  { label: "Cheque", value: "Cheque" },
  {
    label: "Cartão de Crédito + Dinheiro",
    value: "Cartão de Crédito + Dinheiro",
  },
  {
    label: "Cartão de Crédito + Cartão de Débito",
    value: "Cartão de Crédito + Cartão de Débito",
  },
  { label: "Cartão de Débito + Pix", value: "Cartão de Débito + Pix" },
  { label: "Boleto + Cartão de Crédito", value: "Boleto + Cartão de Crédito" },
  { label: "Pix + Dinheiro", value: "Pix + Dinheiro" },
];

function parseMoneyLike(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;

  const cleaned = value
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getConfigPlano(tipoContratoNome: string) {
  if (tipoContratoNome === "Bronze") {
    return {
      nome: "Bronze",
      entradaPadrao: ENTRADA_PADRAO_BRONZE,
      faturadoBase: FATURADO_BASE_BRONZE,
      totalBase: TOTAL_BASE_BRONZE,
      tabela: TABELA_BRONZE,
      cor: {
        ativo: "bg-amber-700 text-white border-amber-800",
        inativo:
          "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300",
        titulo: "text-amber-700",
        tituloTabela: "text-amber-700",
        destaque: "text-amber-100",
        cardBorder: "border-amber-200",
        cardBg: "bg-white",
      },
    };
  }

  if (tipoContratoNome === "Prata") {
    return {
      nome: "Prata",
      entradaPadrao: ENTRADA_PADRAO_PRATA,
      faturadoBase: null,
      totalBase: TOTAL_BASE_PRATA,
      tabela: TABELA_PRATA,
      cor: {
        ativo: "bg-slate-500 text-white border-slate-600",
        inativo:
          "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300",
        titulo: "text-slate-700",
        tituloTabela: "text-slate-700",
        destaque: "text-slate-100",
        cardBorder: "border-slate-200",
        cardBg: "bg-white",
      },
    };
  }

  if (tipoContratoNome === "Ouro") {
    return {
      nome: "Ouro",
      entradaPadrao: ENTRADA_PADRAO_OURO,
      faturadoBase: null,
      totalBase: TABELA_OURO[0].totalPlano,
      tabela: TABELA_OURO,
      cor: {
        ativo: "bg-orange-500 text-white border-orange-600",
        inativo:
          "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300",
        titulo: "text-gray-500",
        tituloTabela: "text-gray-500",
        destaque: "text-orange-100",
        cardBorder: "border-gray-200",
        cardBg: "bg-white",
      },
    };
  }

  if (tipoContratoNome === "Diamante") {
    return {
      nome: "Diamante",
      entradaPadrao: ENTRADA_PADRAO_DIAMANTE,
      faturadoBase: FATURADO_BASE_DIAMANTE,
      totalBase: TOTAL_BASE_DIAMANTE,
      tabela: TABELA_DIAMANTE,
      cor: {
        ativo: "bg-blue-600 text-white border-blue-700",
        inativo:
          "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300",
        titulo: "text-blue-700",
        tituloTabela: "text-blue-700",
        destaque: "text-blue-100",
        cardBorder: "border-blue-200",
        cardBg: "bg-white",
      },
    };
  }

  return null;
}

export function StepPagamento({
  formData,
  handleChange,
  setFormData,
}: StepProps) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  const handleChangeValorLimitado = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const valorDigitado = parseFloat(e.target.value);
    if (e.target.value === "" || valorDigitado <= 10000) {
      handleChange(e);
    }
  };

  const planoConfig = getConfigPlano(formData.tipoContratoNome || "");
  const valorEntradaNumero = parseMoneyLike(formData.valorEntrada);

  const entradaAbaixoDoPadrao =
    !!planoConfig &&
    valorEntradaNumero > 0 &&
    valorEntradaNumero < planoConfig.entradaPadrao;

  const entradaAcimaDoPadrao =
    !!planoConfig && valorEntradaNumero > planoConfig.entradaPadrao;

  const diferencaAbaixo =
    entradaAbaixoDoPadrao && planoConfig
      ? Number((planoConfig.entradaPadrao - valorEntradaNumero).toFixed(2))
      : 0;

  const diferencaAcima =
    entradaAcimaDoPadrao && planoConfig
      ? Number((valorEntradaNumero - planoConfig.entradaPadrao).toFixed(2))
      : 0;

  const ajustarParcelasPlano = Boolean(
    (formData as any).ajustarParcelasPlano
  );

  const aplicarEntradaPadrao = () => {
    if (!setFormData || !planoConfig) return;
    setFormData((prev: any) => ({
      ...prev,
      valorEntrada: String(planoConfig.entradaPadrao),
      valorTotalPlano: "",
      detalhesParcelamento: "",
    }));
  };

  const selecionarModoParcelasPlano = (ajustar: boolean) => {
    if (!setFormData) return;
    setFormData((prev: any) => ({
      ...prev,
      ajustarParcelasPlano: ajustar,
      valorTotalPlano: "",
      detalhesParcelamento: "",
    }));
  };

  const getOpcaoPlanoCalculada = (item: {
    p: number;
    parcela: number;
    totalPlano: number;
  }) => {
    if (!planoConfig) {
      return {
        p: item.p,
        parcelaExibida: item.parcela,
        totalPlanoExibido: item.totalPlano,
      };
    }

    const entradaAtual =
      valorEntradaNumero > 0 ? valorEntradaNumero : planoConfig.entradaPadrao;

    const saldoBase = Number(
      (item.totalPlano - planoConfig.entradaPadrao).toFixed(2)
    );

    if (entradaAbaixoDoPadrao && ajustarParcelasPlano) {
      const saldoAjustado = Number((saldoBase + diferencaAbaixo).toFixed(2));
      const parcelaAjustada = Number((saldoAjustado / item.p).toFixed(2));
      const totalAjustado = Number((entradaAtual + saldoAjustado).toFixed(2));

      return {
        p: item.p,
        parcelaExibida: parcelaAjustada,
        totalPlanoExibido: totalAjustado,
      };
    }

    const parcelaMantida = Number((saldoBase / item.p).toFixed(2));
    const totalReal = Number((entradaAtual + saldoBase).toFixed(2));

    return {
      p: item.p,
      parcelaExibida: parcelaMantida,
      totalPlanoExibido: totalReal,
    };
  };

  const handleSelecionarOpcaoPlano = (item: {
    p: number;
    parcela: number;
    totalPlano: number;
  }) => {
    if (!setFormData) return;

    const opcao = getOpcaoPlanoCalculada(item);

    setFormData((prev: any) => ({
      ...prev,
      valorTotalPlano: Number(opcao.totalPlanoExibido).toFixed(2),
      detalhesParcelamento: `${opcao.p}x de ${formatMoney(
        opcao.parcelaExibida
      )}`,
    }));
  };

  return (
    <Card>
      <CardHeader title="Negociação e Pagamento" />

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 border-b pb-2 border-gray-300">
          1. Dados da Entrada
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Input
              label="Valor da Entrada (R$)"
              name="valorEntrada"
              type="number"
              value={formData.valorEntrada}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e);

                if (!setFormData) return;

                setFormData((prev: any) => ({
                  ...prev,
                  valorEntrada: e.target.value,
                  valorTotalPlano: "",
                  detalhesParcelamento: "",
                }));
              }}
              placeholder="0,00"
            />

            {entradaAbaixoDoPadrao && planoConfig && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-sm font-bold text-orange-900 mb-1">
                  Entrada abaixo do padrão do Plano {planoConfig.nome}
                </div>
                <div className="text-sm text-orange-800">
                  Faltam <b>{formatMoney(diferencaAbaixo)}</b> para chegar na
                  entrada padrão de{" "}
                  <b>{formatMoney(planoConfig.entradaPadrao)}</b>.
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => selecionarModoParcelasPlano(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold border transition ${
                      !ajustarParcelasPlano
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-white text-orange-900 border-orange-300 hover:bg-orange-100"
                    }`}
                  >
                    Manter parcelas
                  </button>

                  <button
                    type="button"
                    onClick={() => selecionarModoParcelasPlano(true)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold border transition ${
                      ajustarParcelasPlano
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-white text-orange-900 border-orange-300 hover:bg-orange-100"
                    }`}
                  >
                    Ajustar parcelas
                  </button>
                </div>

                <div className="text-xs text-orange-800 mt-3">
                  {ajustarParcelasPlano ? (
                    <>
                      A diferença de <b>{formatMoney(diferencaAbaixo)}</b> será
                      adicionada ao saldo e redistribuída nas parcelas.
                    </>
                  ) : (
                    <>
                      As parcelas permanecerão como estão, com base na tabela
                      padrão do Plano {planoConfig.nome}.
                    </>
                  )}
                </div>

                <div className="text-xs text-orange-900 mt-2 font-medium">
                  A entrada foi alterada. Selecione novamente uma opção da
                  tabela.
                </div>
              </div>
            )}

            {entradaAcimaDoPadrao && planoConfig && (
              <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                <div className="text-sm font-bold text-red-700 mb-1">
                  Atenção: entrada acima do permitido
                </div>
                <div className="text-sm text-red-700">
                  O vendedor pegou <b>{formatMoney(diferencaAcima)}</b> a mais
                  do que a entrada padrão de{" "}
                  <b>{formatMoney(planoConfig.entradaPadrao)}</b>.
                </div>

                <div className="text-xs text-red-800 mt-2 font-medium">
                  A entrada foi alterada. Selecione novamente uma opção da
                  tabela.
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">
              Forma de Pagamento (Entrada)
            </label>
            <select
              name="formaDePagamentoEntradaNome"
              value={formData.formaDePagamentoEntradaNome}
              onChange={handleChange}
              className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
            >
              <option value="">Selecione...</option>
              {OPCOES_ENTRADA.map((opcao) => (
                <option key={`entrada-${opcao.value}`} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Detalhes da Entrada"
              name="valorParcela"
              value={formData.valorParcela}
              onChange={handleChange}
              placeholder="Ex: 1x no Pix..."
            />
          </div>
        </div>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-sm text-gray-500 font-medium">
            Saldo Restante / Plano
          </span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 border-b pb-2 border-slate-200">
          2. Dados do Plano (Saldo)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">
              Qual o Plano?
            </label>
            <select
              name="tipoContratoNome"
              value={formData.tipoContratoNome || ""}
              onChange={(e) => {
                handleChange(e);

                if (!setFormData) return;

                const novoPlano = e.target.value;

                if (
                  novoPlano === "Bronze" ||
                  novoPlano === "Prata" ||
                  novoPlano === "Ouro" ||
                  novoPlano === "Diamante"
                ) {
                  setFormData((prev: any) => ({
                    ...prev,
                    tipoContratoNome: novoPlano,
                    ajustarParcelasPlano: false,
                    valorTotalPlano: "",
                    detalhesParcelamento: "",
                  }));
                }
              }}
              className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              <option value="Bronze">Bronze</option>
              <option value="Prata">Prata</option>
              <option value="Ouro">Ouro</option>
              <option value="Diamante">Diamante</option>
            </select>
          </div>

          <Input
            label="Valor Total do Plano (R$)"
            name="valorTotalPlano"
            type="number"
            value={formData.valorTotalPlano || ""}
            onChange={handleChangeValorLimitado}
            max={10000}
            required
            placeholder={planoConfig ? "Selecione na tabela" : "Digite o valor"}
            className="bg-white text-gray-900"
          />

          {planoConfig && (
            <div className="md:col-span-2">
              <div className="text-xs text-gray-600 mt-1">
                Plano selecionado: <b>{planoConfig.nome}</b>. Entrada padrão:{" "}
                <b>{formatMoney(planoConfig.entradaPadrao)}</b>
                {planoConfig.faturadoBase !== null && (
                  <>
                    {" "}
                    | Faturado base:{" "}
                    <b>{formatMoney(planoConfig.faturadoBase)}</b> | Total
                    base: <b>{formatMoney(planoConfig.totalBase)}</b>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {planoConfig && (
          <div
            className={`border rounded-lg p-4 mb-6 shadow-sm ${planoConfig.cor.cardBg} ${planoConfig.cor.cardBorder}`}
          >
            <h3
              className={`text-xs font-bold mb-2 uppercase tracking-wider ${planoConfig.cor.tituloTabela}`}
            >
              Tabela Plano {planoConfig.nome}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
              {planoConfig.tabela.map((item) => {
                const opcao = getOpcaoPlanoCalculada(item);
                const totalOpcao = Number(opcao.totalPlanoExibido).toFixed(2);
                const isSelected =
                  String(formData.valorTotalPlano || "") === totalOpcao;

                return (
                  <button
                    key={item.p}
                    type="button"
                    onClick={() => handleSelecionarOpcaoPlano(item)}
                    className={`
                      flex justify-between items-center p-2 rounded text-xs transition-all border
                      ${isSelected ? planoConfig.cor.ativo : planoConfig.cor.inativo}
                    `}
                    title={`Total do Plano: ${formatMoney(
                      opcao.totalPlanoExibido
                    )}`}
                  >
                    <span
                      className={`font-semibold ${
                        isSelected
                          ? planoConfig.cor.destaque
                          : planoConfig.cor.titulo
                      }`}
                    >
                      {item.p}x
                    </span>

                    <span
                      className={`font-bold ${
                        isSelected ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {formatMoney(opcao.parcelaExibida)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-gray-600">
              * Ao clicar, salvamos o <b>Valor Total do Plano</b> conforme a
              tabela do Plano {planoConfig.nome}.
              {entradaAbaixoDoPadrao && ajustarParcelasPlano && (
                <>
                  {" "}
                  A diferença da entrada foi somada ao saldo para recalcular as
                  parcelas.
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">
              Forma de Pagamento (Plano)
            </label>
            <select
              name="formaDePagamentoNome"
              value={formData.formaDePagamentoNome}
              onChange={handleChange}
              required
              className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black-500 text-gray-900 shadow-sm"
            >
              <option value="">Selecione...</option>
              {OPCOES_PLANO.map((opcao) => (
                <option key={`plano-${opcao.value}`} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Detalhes das Parcelas"
              name="detalhesParcelamento"
              value={formData.detalhesParcelamento}
              onChange={handleChange}
              placeholder="Ex: 12x de R$ 392,00 (Coloque a data de início de pagamento)"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-gray-700">
          Observações Gerais
        </label>
        <textarea
          name="obsPagamento"
          value={formData.obsPagamento}
          onChange={handleChange}
          rows={3}
          placeholder="Informações adicionais | data de início de pagamento do Plano"
          className="border p-3 mt-1 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black-500 w-full text-gray-900"
        ></textarea>

        {planoConfig && (
          <div className="text-xs text-gray-600 mt-2">
            Dica: você pode registrar no Obs que o Plano {planoConfig.nome} tem
            entrada padrão de <b>{formatMoney(planoConfig.entradaPadrao)}</b>
            {planoConfig.faturadoBase !== null && (
              <>
                {" "}
                e total base de <b>{formatMoney(planoConfig.totalBase)}</b>.
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
