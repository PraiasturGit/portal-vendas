"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/service/api";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Search,
  Trash2,
  Loader2,
  FileWarning,
} from "lucide-react";

type Contrato = {
  id: number;
  nome_projeto: string;
  vendedor_id: number;
  id_vendedor_omie?: number;
  id_financeiro?: number;
  data_venda?: string;
  valor_total?: string | number;
  valor_entrada?: string | number;
  metodo_pagamento_entrada?: string;
  metodo_pagamento_restante?: string;
  percentual_comissao?: string | number;
  ncodos_omie?: number;
  created_at?: string;
  status?: string;
  updated_at?: string;
  quantidade_parcelas?: number;
};

function formatarMoeda(valor?: string | number) {
  if (valor === null || valor === undefined || valor === "") return "-";

  const numero = Number(valor);

  if (Number.isNaN(numero)) return String(valor);

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data?: string) {
  if (!data) return "-";

  const d = new Date(data);

  if (Number.isNaN(d.getTime())) return String(data);

  return d.toLocaleDateString("pt-BR");
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default function AdminContratosPage() {
  const { user } = useAuth();

  const [numeroContrato, setNumeroContrato] = useState("");
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const isAdmin = user?.role === "ADMIN";

  async function buscarContrato() {
    const contratoDigitado = numeroContrato.trim().toUpperCase();

    if (!contratoDigitado) {
      setErro("Informe o número do contrato.");
      return;
    }

    setLoading(true);
    setErro("");
    setMensagem("");
    setContrato(null);
    setConfirmacao("");

    try {
      const response = await api.get(`/api/admin/contratos/${contratoDigitado}`);

      if (!response.data?.success) {
        setErro(response.data?.message || "Contrato não encontrado.");
        return;
      }

      setContrato(response.data.data);
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          "Erro ao buscar contrato. Verifique se ele existe."
      );
    } finally {
      setLoading(false);
    }
  }

  async function excluirContrato() {
    if (!contrato?.nome_projeto) {
      setErro("Busque um contrato antes de excluir.");
      return;
    }

    if (confirmacao !== "EXCLUIR") {
      setErro("Digite EXCLUIR para confirmar.");
      return;
    }

    const confirmou = window.confirm(
      `Tem certeza que deseja marcar o contrato ${contrato.nome_projeto} como EXCLUIDO?`
    );

    if (!confirmou) return;

    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      const response = await api.delete(
        `/api/admin/contratos/${contrato.nome_projeto}`
      );

      if (!response.data?.success) {
        setErro(response.data?.message || "Erro ao excluir contrato.");
        return;
      }

      setContrato(response.data.data);
      setMensagem(response.data.message || "Contrato excluído com sucesso.");
      setConfirmacao("");
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          "Erro ao excluir contrato. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-red-700">Acesso restrito</h1>
          <p className="mt-2 text-gray-600">
            Somente usuários administradores podem acessar esta rotina.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white"
          >
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    );
  }

  const contratoExcluido =
    String(contrato?.status || "").toUpperCase() === "EXCLUIDO";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 font-sans">
      <main className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Voltar ao dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Exclusão de Contratos
          </h1>
          <p className="mt-2 text-gray-500">
            Busque um contrato e confirme a exclusão lógica. Nenhum registro
            será apagado fisicamente do banco.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-bold text-gray-700">
                Número do contrato
              </label>
              <input
                value={numeroContrato}
                onChange={(e) =>
                  setNumeroContrato(e.target.value.toUpperCase())
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") buscarContrato();
                }}
                placeholder="Ex: 59279P"
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-gray-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                disabled={loading}
              />
            </div>

            <button
              type="button"
              onClick={buscarContrato}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Search size={18} />
              )}
              Buscar
            </button>
          </div>

          {erro && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
              {erro}
            </div>
          )}

          {mensagem && (
            <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700">
              {mensagem}
            </div>
          )}

          {contrato && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-orange-50 p-3 text-orange-600">
                  <FileWarning size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Contrato encontrado
                  </h2>
                  <p className="text-sm text-gray-500">
                    Confira os dados antes de executar a exclusão.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Info label="Contrato" value={contrato.nome_projeto} />
                <Info label="Status" value={contrato.status || "-"} />
                <Info
                  label="Data da venda"
                  value={formatarData(contrato.data_venda)}
                />
                <Info
                  label="Valor total"
                  value={formatarMoeda(contrato.valor_total)}
                />
                <Info
                  label="Valor entrada"
                  value={formatarMoeda(contrato.valor_entrada)}
                />
                <Info
                  label="Parcelas"
                  value={String(contrato.quantidade_parcelas ?? "-")}
                />
                <Info
                  label="Vendedor ID"
                  value={String(contrato.vendedor_id || "-")}
                />
                <Info
                  label="OS Omie"
                  value={String(contrato.ncodos_omie || "-")}
                />
              </div>

              {contratoExcluido ? (
                <div className="mt-6 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm font-bold text-yellow-800">
                  Este contrato já está marcado como EXCLUIDO.
                </div>
              ) : (
                <div className="mt-6">
                  <label className="mb-1 block text-sm font-bold text-gray-700">
                    Para confirmar, digite EXCLUIR
                  </label>

                  <input
                    value={confirmacao}
                    onChange={(e) => setConfirmacao(e.target.value)}
                    placeholder="EXCLUIR"
                    className="h-12 w-full max-w-sm rounded-xl border border-gray-200 px-4 text-gray-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={excluirContrato}
                    disabled={loading || confirmacao !== "EXCLUIR"}
                    className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Trash2 size={18} />
                    )}
                    Excluir contrato
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}