import React from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";

/* =========================================================================
   TIPOS DE ENTRADA
======================================================================== */
const TIPO_ENTRADA = {
  COM_ENTRADA: "COM_ENTRADA",
  SEM_ENTRADA: "SEM_ENTRADA",
  ISENTA: "ISENTA",
} as const;

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
          "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300",
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
      },
    };
  }

  return null;
}

function SectionHeader({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
        {step}
      </div>
      <h3 className="text-[15px] font-bold text-gray-900 mt-1">{title}</h3>
      {subtitle ? (
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subtitle}</p>
      ) : null}
    </div>
  );
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

  const planoConfig = getConfigPlano(formData.tipoContratoNome || "");
  const tipoEntradaAtual = String(
    (formData as any).tipoEntrada || TIPO_ENTRADA.COM_ENTRADA
  ).toUpperCase();

  const valorEntradaNumero = parseMoneyLike(formData.valorEntrada);

  const isComEntrada = tipoEntradaAtual === TIPO_ENTRADA.COM_ENTRADA;
  const isSemEntrada = tipoEntradaAtual === TIPO_ENTRADA.SEM_ENTRADA;
  const isIsenta = tipoEntradaAtual === TIPO_ENTRADA.ISENTA;

  const respostaEntrada = isSemEntrada || isIsenta ? "NAO" : "SIM";

  const entradaAbaixoDoPadrao =
    !!planoConfig &&
    isComEntrada &&
    valorEntradaNumero > 0 &&
    valorEntradaNumero < planoConfig.entradaPadrao;

  const entradaAcimaDoPadrao =
    !!planoConfig &&
    isComEntrada &&
    valorEntradaNumero > planoConfig.entradaPadrao;

  const diferencaAbaixo =
    entradaAbaixoDoPadrao && planoConfig
      ? Number((planoConfig.entradaPadrao - valorEntradaNumero).toFixed(2))
      : 0;

  const ajustarParcelasPlano = Boolean(
    (formData as any).ajustarParcelasPlano
  );

  const atualizarCampos = (updates: Record<string, any>) => {
    if (!setFormData) return;
    setFormData((prev: any) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleSelecionarPlano = (novoPlano: string) => {
    if (!setFormData) return;

    const config = getConfigPlano(novoPlano);
    const tipoEntradaNovo = String(
      (formData as any).tipoEntrada || TIPO_ENTRADA.COM_ENTRADA
    ).toUpperCase();

    let proximaEntrada = "";

    if (config) {
      if (tipoEntradaNovo === TIPO_ENTRADA.COM_ENTRADA) {
        proximaEntrada = String(config.entradaPadrao);
      } else if (tipoEntradaNovo === TIPO_ENTRADA.ISENTA) {
        proximaEntrada = String(config.entradaPadrao);
      } else {
        proximaEntrada = "0";
      }
    }

    setFormData((prev: any) => ({
      ...prev,
      tipoContratoNome: novoPlano,
      valorEntrada: proximaEntrada,
      formaDePagamentoEntradaNome:
        tipoEntradaNovo === TIPO_ENTRADA.COM_ENTRADA
          ? prev.formaDePagamentoEntradaNome || "Pix"
          : "",
      valorParcela:
        tipoEntradaNovo === TIPO_ENTRADA.COM_ENTRADA
          ? prev.valorParcela || ""
          : "",
      ajustarParcelasPlano: false,
      valorTotalPlano: "",
      detalhesParcelamento: "",
    }));
  };

  const selecionarVaiTerEntrada = (vaiTer: boolean) => {
    if (!setFormData) return;

    if (vaiTer) {
      const entradaPadrao = planoConfig?.entradaPadrao ?? "";
      setFormData((prev: any) => ({
        ...prev,
        tipoEntrada: TIPO_ENTRADA.COM_ENTRADA,
        valorEntrada: entradaPadrao ? String(entradaPadrao) : "",
        formaDePagamentoEntradaNome: prev.formaDePagamentoEntradaNome || "Pix",
        valorParcela: prev.valorParcela || "",
        ajustarParcelasPlano: false,
        valorTotalPlano: "",
        detalhesParcelamento: "",
      }));
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      tipoEntrada: TIPO_ENTRADA.SEM_ENTRADA,
      valorEntrada: "0",
      formaDePagamentoEntradaNome: "",
      valorParcela: "",
      ajustarParcelasPlano: false,
      valorTotalPlano: "",
      detalhesParcelamento: "",
    }));
  };

  const selecionarSemEntradaTipo = (tipo: "SEM_ENTRADA" | "ISENTA") => {
    if (!setFormData) return;

    setFormData((prev: any) => ({
      ...prev,
      tipoEntrada: tipo,
      valorEntrada:
        tipo === "SEM_ENTRADA"
          ? "0"
          : String(planoConfig?.entradaPadrao || ""),
      formaDePagamentoEntradaNome: "",
      valorParcela: "",
      ajustarParcelasPlano: false,
      valorTotalPlano: "",
      detalhesParcelamento: "",
    }));
  };

  const selecionarModoParcelasPlano = (ajustar: boolean) => {
    atualizarCampos({
      ajustarParcelasPlano: ajustar,
      valorTotalPlano: "",
      detalhesParcelamento: "",
    });
  };

  const handleChangeEntrada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorDigitado = e.target.value;

    if (!setFormData) return;

    const normalizado = valorDigitado
      .replace(/[^\d,.-]/g, "")
      .replace(/\.(?=.*\.)/g, "");

    setFormData((prev: any) => ({
      ...prev,
      valorEntrada: normalizado,
      valorTotalPlano: "",
      detalhesParcelamento: "",
    }));
  };

  const getOpcaoPlanoCalculada = (item: TabelaItem) => {
    if (!planoConfig) {
      return {
        p: item.p,
        parcelaExibida: item.parcela,
        totalPlanoExibido: item.totalPlano,
      };
    }

    if (isSemEntrada) {
      const totalSemEntrada = Number(item.totalPlano.toFixed(2));
      const parcelaSemEntrada = Number((totalSemEntrada / item.p).toFixed(2));

      return {
        p: item.p,
        parcelaExibida: parcelaSemEntrada,
        totalPlanoExibido: totalSemEntrada,
      };
    }

    if (isIsenta) {
      const totalIsento = Number(
        (item.totalPlano - planoConfig.entradaPadrao).toFixed(2)
      );
      const parcelaIsenta = Number((totalIsento / item.p).toFixed(2));

      return {
        p: item.p,
        parcelaExibida: parcelaIsenta,
        totalPlanoExibido: totalIsento,
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

  const handleSelecionarOpcaoPlano = (item: TabelaItem) => {
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

  const opcaoSelecionada =
    planoConfig?.tabela.find((item) => {
      const opcao = getOpcaoPlanoCalculada(item);
      return Number(opcao.totalPlanoExibido).toFixed(2) === String(formData.valorTotalPlano || "");
    }) || null;

  const resumoOpcaoSelecionada = opcaoSelecionada
    ? getOpcaoPlanoCalculada(opcaoSelecionada)
    : null;

  const tituloTabela = () => {
    if (!planoConfig) return "Escolha a parcela";
    return `Escolha a parcela do Plano ${planoConfig.nome}`;
  };

  return (
    <Card>
      <CardHeader title="Pagamento da venda" />

      <div className="space-y-4">
        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <SectionHeader step="Etapa 1" title="Escolha o plano" />

          <select
            name="tipoContratoNome"
            value={formData.tipoContratoNome || ""}
            onChange={(e) => {
              handleChange(e);

              const novoPlano = e.target.value;

              if (
                novoPlano === "Bronze" ||
                novoPlano === "Prata" ||
                novoPlano === "Ouro" ||
                novoPlano === "Diamante"
              ) {
                handleSelecionarPlano(novoPlano);
              }
            }}
            className="w-full border p-3.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm text-sm"
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
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <SectionHeader
            step="Etapa 2"
            title="Vai ter entrada nessa venda?"
          />

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => selecionarVaiTerEntrada(true)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                respostaEntrada === "SIM"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 bg-white active:scale-[0.99]"
              }`}
            >
              <div className="text-sm font-bold text-gray-900">Sim</div>
            </button>

            <button
              type="button"
              onClick={() => selecionarVaiTerEntrada(false)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                respostaEntrada === "NAO"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white active:scale-[0.99]"
              }`}
            >
              <div className="text-sm font-bold text-gray-900">Não</div>
            </button>
          </div>
        </section>

        {respostaEntrada === "NAO" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-4">
            <SectionHeader
              step="Etapa 3"
              title="Como será o plano?"
            />

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => selecionarSemEntradaTipo("SEM_ENTRADA")}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSemEntrada
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white active:scale-[0.99]"
                }`}
              >
                <div className="text-sm font-bold text-gray-900">
                  Plano integral
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Cliente não paga entrada.
                </div>
              </button>

              <button
                type="button"
                onClick={() => selecionarSemEntradaTipo("ISENTA")}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isIsenta
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white active:scale-[0.99]"
                }`}
              >
                <div className="text-sm font-bold text-gray-900">
                  Entrada bonificada
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Cliente não paga a entrada porque ela foi bonificada.
                </div>
              </button>
            </div>
          </section>
        )}

        {isComEntrada && (
          <section className="rounded-2xl border border-gray-200 bg-white p-4">
            <SectionHeader step="Etapa 3" title="Dados da entrada" />

            <div className="space-y-4">
              <Input
                label="Valor da entrada"
                name="valorEntrada"
                type="text"
                inputMode="decimal"
                value={formData.valorEntrada}
                onChange={handleChangeEntrada}
                placeholder={
                  planoConfig ? String(planoConfig.entradaPadrao) : "0,00"
                }
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-gray-900">
                  Forma de pagamento da entrada
                </label>
                <select
                  name="formaDePagamentoEntradaNome"
                  value={formData.formaDePagamentoEntradaNome}
                  onChange={handleChange}
                  className="border p-3.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm text-sm"
                >
                  <option value="">Selecione...</option>
                  {OPCOES_ENTRADA.map((opcao) => (
                    <option key={`entrada-${opcao.value}`} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Como a entrada será paga?"
                name="valorParcela"
                value={formData.valorParcela}
                onChange={handleChange}
                placeholder="Ex: 1x no Pix"
              />
            </div>

            {entradaAbaixoDoPadrao && planoConfig && (
              <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <div className="text-sm font-bold text-orange-900">
                  Entrada menor que a padrão
                </div>
                <div className="text-xs text-orange-800 mt-1">
                  Faltam <b>{formatMoney(diferencaAbaixo)}</b>.
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    type="button"
                    onClick={() => selecionarModoParcelasPlano(false)}
                    className={`w-full rounded-xl px-3 py-3 text-sm font-bold border transition ${
                      !ajustarParcelasPlano
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-white text-orange-900 border-orange-300"
                    }`}
                  >
                    Perder parte da entrada
                  </button>

                  <button
                    type="button"
                    onClick={() => selecionarModoParcelasPlano(true)}
                    className={`w-full rounded-xl px-3 py-3 text-sm font-bold border transition ${
                      ajustarParcelasPlano
                        ? "bg-orange-500 text-white border-orange-600"
                        : "bg-white text-orange-900 border-orange-300"
                    }`}
                  >
                    Jogar diferença nas parcelas
                  </button>
                </div>

                <div className="text-xs text-orange-800 mt-3">
                  {!ajustarParcelasPlano
                    ? "A diferença da entrada não será recuperada nas parcelas."
                    : "A diferença da entrada será somada nas parcelas do plano."}
                </div>
              </div>
            )}

            {entradaAcimaDoPadrao && planoConfig && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="text-sm font-bold text-red-700">
                  Atenção: entrada acima do padrão
                </div>
                <div className="text-xs text-red-700 mt-1">
                  Foi informado um valor acima da entrada padrão do plano.
                </div>
              </div>
            )}
          </section>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <SectionHeader
            step={isComEntrada ? "Etapa 4" : "Etapa 4"}
            title={tituloTabela()}
            subtitle="Toque na opção desejada."
          />

          {resumoOpcaoSelecionada && (
            <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-500">
                Selecionado
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {resumoOpcaoSelecionada.p}x de{" "}
                {formatMoney(resumoOpcaoSelecionada.parcelaExibida)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Total do plano:{" "}
                {formatMoney(resumoOpcaoSelecionada.totalPlanoExibido)}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {planoConfig?.tabela.map((item) => {
              const opcao = getOpcaoPlanoCalculada(item);
              const totalOpcao = Number(opcao.totalPlanoExibido).toFixed(2);
              const isSelected =
                String(formData.valorTotalPlano || "") === totalOpcao;

              return (
                <button
                  key={item.p}
                  type="button"
                  onClick={() => handleSelecionarOpcaoPlano(item)}
                  className={`min-h-[84px] rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                    isSelected
                      ? `${planoConfig.cor.ativo} shadow-sm`
                      : planoConfig.cor.inativo
                  }`}
                  title={`Total do Plano: ${formatMoney(
                    opcao.totalPlanoExibido
                  )}`}
                >
                  <div className="text-[11px] opacity-80">{item.p}x</div>
                  <div className="text-sm font-bold mt-1 leading-tight">
                    {formatMoney(opcao.parcelaExibida)}
                  </div>
                  <div className="text-[11px] mt-2 opacity-80">
                    Total {formatMoney(opcao.totalPlanoExibido)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <Input
              label="Valor total do plano"
              name="valorTotalPlano"
              type="number"
              value={formData.valorTotalPlano || ""}
              onChange={handleChange}
              max={10000}
              required
              placeholder="Selecione na tabela"
              className="bg-white text-gray-900"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <SectionHeader
            step={isComEntrada ? "Etapa 5" : "Etapa 5"}
            title="Pagamento do plano"
          />

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-900">
                Forma de pagamento do plano
              </label>
              <select
                name="formaDePagamentoNome"
                value={formData.formaDePagamentoNome}
                onChange={handleChange}
                required
                className="border p-3.5 rounded-xl bg-white outline-none focus:ring-2 focus:ring-black text-gray-900 shadow-sm text-sm"
              >
                <option value="">Selecione...</option>
                {OPCOES_PLANO.map((opcao) => (
                  <option key={`plano-${opcao.value}`} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Resumo das parcelas"
              name="detalhesParcelamento"
              value={formData.detalhesParcelamento}
              onChange={handleChange}
              placeholder="Ex: 12x de R$ 392,00"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4">
          <SectionHeader step="Opcional" title="Observações" />

          <textarea
            name="obsPagamento"
            value={formData.obsPagamento}
            onChange={handleChange}
            rows={3}
            placeholder="Informações adicionais"
            className="border p-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-black w-full text-gray-900 text-sm"
          />
        </section>
      </div>
    </Card>
  );
}
