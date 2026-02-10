import React from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";

/* =========================================================================
   ✅ PLANOS OURO (4 VARIAÇÕES)
   IMPORTANTE:
   - "Valor Total do Plano" NÃO é parcelas * valor da parcela.
   - Por isso cada linha guarda: parcelas, valorParcela e totalPlano.
   - Fonte:
     Ouro 2: :contentReference[oaicite:1]{index=1}
     Ouro 3: :contentReference[oaicite:2]{index=2}
     Ouro 4: :contentReference[oaicite:3]{index=3}
   - Ouro 1: você colou na conversa (não veio em PDF aqui); mantive a sua tabela antiga
     e ajustei os totals com base no que você escreveu acima.
======================================================================== */

// OURO 1 (baseado no texto que você colou)
const TABELA_OURO_1 = [
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

// OURO 2 (Entrada 680; Comissão 43%) :contentReference[oaicite:4]{index=4}
const TABELA_OURO_2 = [
  { p: 1, parcela: 4400.0, totalPlano: 5080.0 },
  { p: 2, parcela: 2260.0, totalPlano: 5200.0 },
  { p: 3, parcela: 1542.0, totalPlano: 5306.0 },
  { p: 4, parcela: 1170.0, totalPlano: 5360.0 },
  { p: 5, parcela: 948.0, totalPlano: 5420.0 },
  { p: 6, parcela: 793.0, totalPlano: 5438.0 },
  { p: 7, parcela: 684.0, totalPlano: 5468.0 },
  { p: 8, parcela: 600.0, totalPlano: 5480.0 },
  { p: 9, parcela: 537.0, totalPlano: 5513.0 },
  { p: 10, parcela: 485.0, totalPlano: 5530.0 },
  { p: 11, parcela: 443.0, totalPlano: 5553.0 },
  { p: 12, parcela: 409.0, totalPlano: 5588.0 },
  { p: 13, parcela: 380.0, totalPlano: 5620.0 },
  { p: 14, parcela: 354.0, totalPlano: 5636.0 },
  { p: 15, parcela: 331.0, totalPlano: 5645.0 },
  { p: 16, parcela: 313.0, totalPlano: 5688.0 },
  { p: 17, parcela: 297.0, totalPlano: 5729.0 },
  { p: 18, parcela: 281.0, totalPlano: 5738.0 },
  { p: 19, parcela: 271.0, totalPlano: 5829.0 },
  { p: 20, parcela: 260.0, totalPlano: 5880.0 },
  { p: 21, parcela: 250.0, totalPlano: 5930.0 },
  { p: 22, parcela: 239.0, totalPlano: 5938.0 },
  { p: 23, parcela: 231.0, totalPlano: 5993.0 },
  { p: 24, parcela: 223.0, totalPlano: 6032.0 },
];

// OURO 3 (Entrada 480; Comissão 45%) :contentReference[oaicite:5]{index=5}
const TABELA_OURO_3 = [
  { p: 1, parcela: 4600.0, totalPlano: 5080.0 },
  { p: 2, parcela: 2360.0, totalPlano: 5200.0 },
  { p: 3, parcela: 1608.0, totalPlano: 5304.0 },
  { p: 4, parcela: 1220.0, totalPlano: 5360.0 },
  { p: 5, parcela: 988.0, totalPlano: 5420.0 },
  { p: 6, parcela: 827.0, totalPlano: 5442.0 },
  { p: 7, parcela: 712.0, totalPlano: 5464.0 },
  { p: 8, parcela: 625.0, totalPlano: 5480.0 },
  { p: 9, parcela: 559.0, totalPlano: 5511.0 },
  { p: 10, parcela: 505.0, totalPlano: 5530.0 },
  { p: 11, parcela: 461.0, totalPlano: 5551.0 },
  { p: 12, parcela: 425.0, totalPlano: 5580.0 },
  { p: 13, parcela: 396.0, totalPlano: 5628.0 },
  { p: 14, parcela: 369.0, totalPlano: 5646.0 },
  { p: 15, parcela: 345.0, totalPlano: 5655.0 },
  { p: 16, parcela: 325.0, totalPlano: 5680.0 },
  { p: 17, parcela: 309.0, totalPlano: 5733.0 },
  { p: 18, parcela: 292.0, totalPlano: 5736.0 },
  { p: 19, parcela: 281.0, totalPlano: 5819.0 },
  { p: 20, parcela: 270.0, totalPlano: 5880.0 },
  { p: 21, parcela: 259.0, totalPlano: 5919.0 },
  { p: 22, parcela: 248.0, totalPlano: 5936.0 },
  { p: 23, parcela: 239.0, totalPlano: 5977.0 },
  { p: 24, parcela: 232.0, totalPlano: 6048.0 },
];

// OURO 4 (Entrada 280; Comissão 47%) :contentReference[oaicite:6]{index=6}
const TABELA_OURO_4 = [
  { p: 1, parcela: 4800.0, totalPlano: 5080.0 },
  { p: 2, parcela: 2460.0, totalPlano: 5200.0 },
  { p: 3, parcela: 1675.0, totalPlano: 5305.0 },
  { p: 4, parcela: 1270.0, totalPlano: 5360.0 },
  { p: 5, parcela: 1028.0, totalPlano: 5420.0 },
  { p: 6, parcela: 860.0, totalPlano: 5440.0 },
  { p: 7, parcela: 741.0, totalPlano: 5467.0 },
  { p: 8, parcela: 650.0, totalPlano: 5480.0 },
  { p: 9, parcela: 582.0, totalPlano: 5518.0 },
  { p: 10, parcela: 525.0, totalPlano: 5530.0 },
  { p: 11, parcela: 480.0, totalPlano: 5560.0 },
  { p: 12, parcela: 442.0, totalPlano: 5584.0 },
  { p: 13, parcela: 411.0, totalPlano: 5623.0 },
  { p: 14, parcela: 383.0, totalPlano: 5642.0 },
  { p: 15, parcela: 358.0, totalPlano: 5650.0 },
  { p: 16, parcela: 338.0, totalPlano: 5688.0 },
  { p: 17, parcela: 320.0, totalPlano: 5720.0 },
  { p: 18, parcela: 303.0, totalPlano: 5734.0 },
  { p: 19, parcela: 292.0, totalPlano: 5828.0 },
  { p: 20, parcela: 280.0, totalPlano: 5880.0 },
  { p: 21, parcela: 269.0, totalPlano: 5929.0 },
  { p: 22, parcela: 257.0, totalPlano: 5934.0 },
  { p: 23, parcela: 248.0, totalPlano: 5984.0 },
  { p: 24, parcela: 240.0, totalPlano: 6040.0 },
];

// Entrada “padrão” de cada subplano Ouro (pra facilitar na operação)
const ENTRADA_PADRAO_OURO: Record<string, number> = {
  "Ouro 1": 880, // não veio no PDF, então deixei 0 aqui
  "Ouro 2": 680, // :contentReference[oaicite:7]{index=7}
  "Ouro 3": 480, // :contentReference[oaicite:8]{index=8}
  "Ouro 4": 280, // :contentReference[oaicite:9]{index=9}
};

type LinhaOuro = { p: number; parcela: number; totalPlano: number };

function getTabelaOuro(subPlano: string): LinhaOuro[] {
  if (subPlano === "Ouro 2") return TABELA_OURO_2;
  if (subPlano === "Ouro 3") return TABELA_OURO_3;
  if (subPlano === "Ouro 4") return TABELA_OURO_4;
  return TABELA_OURO_1;
}

/* =========================================================================
   PRATA (mantive como você tinha; depois você me manda as 4 variações do prata
   se existir que eu ajusto igual)
======================================================================== */
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

// --- LISTA 1: OPÇÕES PARA ENTRADA (Conforme vendaService.js - FORMA_PAGAMENTO_ENTRADA_MAP) ---
const OPCOES_ENTRADA = [
  { label: "Pix", value: "Pix" },
  { label: "Dinheiro", value: "Dinheiro" },
  { label: "Cartão de Crédito", value: "Cartão de Crédito" },
  { label: "Cartão de Débito", value: "Cartão de Débito" },
  { label: "Boleto", value: "Boleto" },
  { label: "Cheque", value: "Cheque" },
  { label: "Cartão de Crédito + Dinheiro", value: "Cartão de Crédito + Dinheiro" },
  { label: "Cartão de Crédito + Cartão de Débito", value: "Cartão de Débito + Crédito" },
  { label: "Cartão de Débito + Pix", value: "Cartão de Débito + Pix" },
  { label: "Cartão de Crédito + Pix", value: "Cartão de Crédito + Pix" },
  { label: "Pix + Dinheiro", value: "Pix + Dinheiro" },
];

// --- LISTA 2: OPÇÕES PARA PLANO (Conforme vendaService.js - FORMA_PAGAMENTO_MAP) ---
const OPCOES_PLANO = [
  { label: "Pix", value: "PIX" },
  { label: "Cartão de Crédito", value: "Cartão de Crédito" },
  { label: "Boleto", value: "Boleto" },
  { label: "Cartão de Débito", value: "Cartão de Débito" },
  { label: "Cheque", value: "Cheque" },
  { label: "Cartão de Crédito + Dinheiro", value: "Cartão de Crédito + Dinheiro" },
  { label: "Cartão de Crédito + Cartão de Débito", value: "Cartão de Crédito + Cartão de Débito" },
  { label: "Cartão de Débito + Pix", value: "Cartão de Débito + Pix" },
  { label: "Boleto + Cartão de Crédito", value: "Boleto + Cartão de Crédito" },
  { label: "Pix + Dinheiro", value: "Pix + Dinheiro" },
];

export function StepPagamento({ formData, handleChange, setFormData }: StepProps) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const handleChangeValorLimitado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorDigitado = parseFloat(e.target.value);
    if (e.target.value === "" || valorDigitado <= 10000) {
      handleChange(e);
    }
  };

  // ✅ agora recebe totalPlano (coluna do PDF)
  const handleSelecionarOpcaoOuro = (parcelas: number, valorParcela: number, totalPlano: number) => {
    if (!setFormData) return;

    setFormData((prev: any) => ({
      ...prev,
      valorTotalPlano: Number(totalPlano).toFixed(2),
      detalhesParcelamento: `${parcelas}x de ${formatMoney(valorParcela)}`,
    }));
  };

  const handleSelecionarOpcaoPrata = (parcelas: number, valorParcela: number) => {
    if (!setFormData) return;
    const totalCalculado = parcelas * valorParcela;

    setFormData((prev: any) => ({
      ...prev,
      valorTotalPlano: totalCalculado.toFixed(2),
      detalhesParcelamento: `${parcelas}x de ${formatMoney(valorParcela)}`,
    }));
  };

  const isPlanoOuro = formData.tipoContratoNome === "Ouro";
  const isPlanoPrata = formData.tipoContratoNome === "Prata";

  // ✅ subPlanoOuro vive só no front (não mexe no backend)
  const subPlanoOuro = (formData as any).subPlanoOuro || "Ouro 1";
  const tabelaOuroAtual = getTabelaOuro(subPlanoOuro);
  const entradaPadrao = ENTRADA_PADRAO_OURO[subPlanoOuro] ?? 0;

  const aplicarEntradaPadrao = () => {
    if (!setFormData) return;
    setFormData((prev: any) => ({
      ...prev,
      valorEntrada: String(entradaPadrao || 0),
    }));
  };

  return (
    <Card>
      <CardHeader title="Negociação e Pagamento" />

      {/* =================================================================
          BLOCO 1: ENTRADA
      ================================================================= */}
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
              onChange={handleChange}
              placeholder="0,00"
            />

            {/* ✅ Ajuda operacional: entrada padrão do subplano Ouro (2/3/4) */}
            {isPlanoOuro && (
              <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-700">
                  <div className="font-bold">Entrada padrão ({subPlanoOuro})</div>
                  <div className="text-gray-600">{formatMoney(entradaPadrao)}</div>
                </div>
                <button
                  type="button"
                  onClick={aplicarEntradaPadrao}
                  className="px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-bold hover:bg-orange-600"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">Forma de Pagamento (Entrada)</label>
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

      {/* =================================================================
          BLOCO 2: O PLANO
      ================================================================= */}
      <div className="bg-slate-50 p-4 rounded-lg border border-blue-100 mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 border-b pb-2 border-slate-200">
          2. Dados do Plano (Saldo)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">Qual o Plano?</label>
            <select
              name="tipoContratoNome"
              value={formData.tipoContratoNome || ""}
              onChange={handleChange}
              className="border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              <option value="Ouro">Ouro</option>
              <option value="Prata">Prata</option>
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
            placeholder="Selecione na tabela"
            className="bg-white text-gray-900"
          />

          {/* ✅ aparece só se for Ouro: escolha 1–4 */}
          {isPlanoOuro && (
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-900">Qual Tabela do Ouro?</label>
              <select
                value={subPlanoOuro}
                onChange={(e) => {
                  if (!setFormData) return;
                  const novo = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    subPlanoOuro: novo,
                    // limpa seleção anterior pra não ficar “travado” num total de outra tabela
                    valorTotalPlano: "",
                    detalhesParcelamento: "",
                  }));
                }}
                className="mt-1 border p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm w-full"
              >
                <option value="Ouro 1">Ouro 1</option>
                <option value="Ouro 2">Ouro 2</option>
                <option value="Ouro 3">Ouro 3</option>
                <option value="Ouro 4">Ouro 4</option>
              </select>

              <div className="text-xs text-gray-600 mt-2">
                Você selecionou: <b>{subPlanoOuro}</b>. (Entrada padrão:{" "}
                <b>{formatMoney(entradaPadrao)}</b>)
              </div>
            </div>
          )}
        </div>

        {/* =========================
            TABELA OURO (1–4)
        ========================= */}
        {isPlanoOuro && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Tabela {subPlanoOuro}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
              {tabelaOuroAtual.map((item) => {
                const totalOpcao = Number(item.totalPlano).toFixed(2);
                const isSelected = String(formData.valorTotalPlano || "") === totalOpcao;

                return (
                  <button
                    key={item.p}
                    type="button"
                    onClick={() => handleSelecionarOpcaoOuro(item.p, item.parcela, item.totalPlano)}
                    className={`
                      flex justify-between items-center p-2 rounded text-xs transition-all border
                      ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-600 shadow-md transform scale-[1.02]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      }
                    `}
                    title={`Total do Plano: ${formatMoney(item.totalPlano)}`}
                  >
                    <span className={`font-semibold ${isSelected ? "text-orange-100" : "text-gray-500"}`}>
                      {item.p}x
                    </span>

                    <span className={`font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                      {formatMoney(item.parcela)}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-xs text-gray-600">
              * Ao clicar, salvamos o <b>Valor Total do Plano</b> conforme tabela ({subPlanoOuro}).
            </div>
          </div>
        )}

        {/* =========================
            TABELA PRATA (como estava)
        ========================= */}
        {isPlanoPrata && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Tabela Prata 2025
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
              {TABELA_PRATA_2025.map((item) => {
                const totalOpcao = (item.p * item.v).toFixed(2);
                const isSelected = formData.valorTotalPlano === totalOpcao;

                return (
                  <button
                    key={item.p}
                    type="button"
                    onClick={() => handleSelecionarOpcaoPrata(item.p, item.v)}
                    className={`
                      flex justify-between items-center p-2 rounded text-xs transition-all border
                      ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-600 shadow-md transform scale-[1.02]"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      }
                    `}
                  >
                    <span className={`font-semibold ${isSelected ? "text-orange-100" : "text-gray-500"}`}>
                      {item.p}x
                    </span>
                    <span className={`font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                      {formatMoney(item.v)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-gray-900">Forma de Pagamento (Plano)</label>
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
              placeholder="Ex: 12x de R$ 392,00 (Coloque a data de inicio de pagamento)"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-bold text-gray-700">Observações Gerais</label>
        <textarea
          name="obsPagamento"
          value={formData.obsPagamento}
          onChange={handleChange}
          rows={3}
          placeholder="Informações adicionais | data de inicio de pagamento do Plano"
          className="border p-3 mt-1 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black-500 w-full text-gray-900"
        ></textarea>

        {/* ✅ Dica: deixa o subplano visível pra equipe */}
        {isPlanoOuro && (
          <div className="text-xs text-gray-600 mt-2">
            Dica: você pode registrar no Obs: <b>{subPlanoOuro}</b>.
          </div>
        )}
      </div>
    </Card>
  );
}
