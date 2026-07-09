"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/service/api";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  ArrowLeft,
  Send,
  Gift,
  ChevronRight,
  Check,
  Search,
  X,
} from "lucide-react";

type FormState = {
  nomeGanhador: string;
  cpf: string;
  telefone: string;
  email: string;
  cidade: string;
  estado: string;
};

type ErrorState = {
  nomeGanhador: boolean;
  cpf: boolean;
  telefone: boolean;
  email: boolean;
  cidade: boolean;
  estado: boolean;
};

type CidadeOption = {
  id: number;
  nome: string;
};

type PickerOption = {
  value: string;
  label: string;
};

const ESTADOS = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCPF(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
    6,
    9
  )}-${digits.slice(9, 11)}`;
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
    7,
    11
  )}`;
}

function isValidCPF(cpf: string) {
  const clean = onlyDigits(cpf);

  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(clean.charAt(i)) * (10 - i);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(clean.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(clean.charAt(i)) * (11 - i);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;

  return secondDigit === Number(clean.charAt(10));
}

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

function MobilePicker({
  open,
  title,
  placeholderSearch,
  options,
  selectedValue,
  onClose,
  onSelect,
}: {
  open: boolean;
  title: string;
  placeholderSearch: string;
  options: PickerOption[];
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const filteredOptions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(term)
    );
  }, [options, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-[26px] bg-white shadow-2xl">
        <div className="mx-auto mt-2.5 h-1.5 w-11 rounded-full bg-gray-300" />

        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <h3 className="text-base font-semibold text-[#111827]">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600"
          >
            <X size={17} />
          </button>
        </div>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholderSearch}
              className="h-11 w-full rounded-2xl border border-gray-200 bg-[#f8fafc] pl-10 pr-4 text-sm text-[#111827] outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
            />
          </div>
        </div>

        <div className="max-h-[58vh] overflow-y-auto px-3 pb-4">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-7 text-center text-sm text-gray-500">
              Nenhum resultado encontrado.
            </div>
          ) : (
            filteredOptions.map((option) => {
              const selected = option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  className={`mb-2 flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left transition ${
                    selected
                      ? "bg-orange-50 ring-1 ring-orange-200"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium text-[#111827]">
                    {option.label}
                  </span>

                  {selected ? (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white">
                      <Check size={14} />
                    </span>
                  ) : (
                    <ChevronRight size={17} className="text-gray-300" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function PickerField({
  label,
  value,
  placeholder,
  onClick,
  required,
  error,
  disabled,
}: {
  label: string;
  value: string;
  placeholder: string;
  onClick: () => void;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
}) {
  const hasValue = Boolean(value);

  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`flex h-11 w-full items-center justify-between rounded-2xl border px-4 text-left transition-all disabled:cursor-not-allowed disabled:bg-gray-100 ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : "border-gray-200 bg-white"
        }`}
      >
        <span
          className={`truncate text-sm ${
            hasValue ? "text-[#111827]" : "text-gray-400"
          }`}
        >
          {hasValue ? value : placeholder}
        </span>

        <ChevronRight
          size={17}
          className={disabled ? "text-gray-300" : "text-gray-400"}
        />
      </button>
    </div>
  );
}

export default function ConviteCortesiaPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [cidades, setCidades] = useState<CidadeOption[]>([]);
  const [apiError, setApiError] = useState("");

  const [estadoPickerOpen, setEstadoPickerOpen] = useState(false);
  const [cidadePickerOpen, setCidadePickerOpen] = useState(false);

  const [errors, setErrors] = useState<ErrorState>({
    nomeGanhador: false,
    cpf: false,
    telefone: false,
    email: false,
    cidade: false,
    estado: false,
  });

  const [form, setForm] = useState<FormState>({
    nomeGanhador: "",
    cpf: "",
    telefone: "",
    email: "",
    cidade: "",
    estado: "",
  });

  const estadoOptions: PickerOption[] = useMemo(
    () =>
      ESTADOS.map((estado) => ({
        value: estado.uf,
        label: `${estado.nome} - ${estado.uf}`,
      })),
    []
  );

  const cidadeOptions: PickerOption[] = useMemo(
    () =>
      cidades.map((cidade) => ({
        value: cidade.nome,
        label: cidade.nome,
      })),
    [cidades]
  );

  const estadoLabel = useMemo(() => {
    const found = ESTADOS.find((item) => item.uf === form.estado);
    return found ? `${found.nome} - ${found.uf}` : "";
  }, [form.estado]);

  useEffect(() => {
    async function carregarCidades() {
      if (!form.estado) {
        setCidades([]);
        return;
      }

      setLoadingCidades(true);
      setApiError("");

      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.estado}/municipios`
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar as cidades.");
        }

        const data = await response.json();

        const cidadesFormatadas = (data || []).map((cidade: CidadeOption) => ({
          id: cidade.id,
          nome: cidade.nome,
        }));

        setCidades(cidadesFormatadas);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
        setCidades([]);
        setApiError("Não foi possível carregar as cidades do estado selecionado.");
      } finally {
        setLoadingCidades(false);
      }
    }

    carregarCidades();
  }, [form.estado]);

  const clearFieldError = (field: keyof ErrorState) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "cpf") finalValue = formatCPF(value);
    if (name === "telefone") finalValue = formatPhone(value);

    setForm((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    setApiError("");
    clearFieldError(name as keyof ErrorState);
  };

  const validateField = (field: keyof FormState, value: string) => {
    switch (field) {
      case "nomeGanhador": {
        const nomes = value.trim().split(/\s+/).filter(Boolean);
        return nomes.length >= 2;
      }
      case "cpf":
        return isValidCPF(value);
      case "telefone":
        return onlyDigits(value).length === 11;
      case "email":
        return isValidEmail(value);
      case "cidade":
      case "estado":
        return value.trim().length > 0;
      default:
        return true;
    }
  };

  const handleBlurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof FormState;

    setErrors((prev) => ({
      ...prev,
      [field]: !validateField(field, value),
    }));
  };

  const validateForm = () => {
    const newErrors: ErrorState = {
      nomeGanhador: !validateField("nomeGanhador", form.nomeGanhador),
      cpf: !validateField("cpf", form.cpf),
      telefone: !validateField("telefone", form.telefone),
      email: !validateField("email", form.email),
      cidade: !validateField("cidade", form.cidade),
      estado: !validateField("estado", form.estado),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const getApiErrorMessage = (error: any) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.mensagem ||
      error?.response?.data?.erro ||
      error?.response?.data?.error ||
      "Erro ao gerar cortesia."
    );
  };

  const handleSelectEstado = (uf: string) => {
    setForm((prev) => ({
      ...prev,
      estado: uf,
      cidade: "",
    }));

    setApiError("");
    clearFieldError("estado");
    clearFieldError("cidade");
  };

  const handleSelectCidade = (cidade: string) => {
    setForm((prev) => ({
      ...prev,
      cidade,
    }));

    setApiError("");
    clearFieldError("cidade");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      alert("Preencha corretamente todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nomeGanhador: form.nomeGanhador.trim(),
        cpf: onlyDigits(form.cpf),
        telefone: onlyDigits(form.telefone),
        email: form.email.trim().toLowerCase(),
        cidade: form.cidade,
        estado: form.estado,
      };

      const response = await api.post("/api/convites/cortesia", payload);

      const numeroConvite = response?.data?.data?.numeroConvite;

      alert(
        response?.data?.message ||
          response?.data?.mensagem ||
          `✅ Cortesia gerada com sucesso! ${
            numeroConvite ? `Número: ${numeroConvite}` : ""
          }`
      );

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro ao gerar cortesia:", error);
      const message = getApiErrorMessage(error);
      setApiError(message);
      alert(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 mb-3 bg-white px-3 py-3 shadow-sm">
          <div className="mx-auto flex max-w-md items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="h-9 w-9 rounded-full border-gray-200 p-2"
              >
                <ArrowLeft size={18} />
              </Button>
            </Link>

            <div className="flex items-center gap-2 text-orange-600">
              <Gift size={20} />
              <h1 className="text-lg font-bold text-gray-800">
                Cortesia Especial
              </h1>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-md px-3 pb-3">
          <form onSubmit={handleSubmit}>
            <Card className="rounded-[22px]">
              <div className="px-3 pt-3">
                <CardHeader
                  title="Dados do Ganhador"
                  subtitle="Gere uma cortesia especial de 2 diárias"
                />
              </div>

              <div className="mx-3 mb-3 rounded-2xl border border-orange-100 bg-orange-50 px-3 py-2 text-xs leading-relaxed text-orange-800">
                Esta cortesia contempla 2 diárias para 2 pessoas em residenciais
                próprios do Grupo Praiastur, mediante disponibilidade e conforme
                regulamento interno.
              </div>

              <div className="space-y-2.5 px-3 pb-3">
                <div>
                  <Input
                    label="Nome do Ganhador"
                    name="nomeGanhador"
                    value={form.nomeGanhador}
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                    required
                    placeholder="Nome completo"
                    className={`h-11 text-sm ${
                      errors.nomeGanhador
                        ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {errors.nomeGanhador && (
                    <span className="mt-1 block text-[11px] text-red-500">
                      Digite nome e sobrenome.
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    label="CPF"
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                    required
                    placeholder="000.000.000-00"
                    className={`h-11 text-sm ${
                      errors.cpf
                        ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {errors.cpf && (
                    <span className="mt-1 block text-[11px] text-red-500">
                      Digite um CPF válido.
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    label="Telefone / WhatsApp"
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                    required
                    placeholder="(00) 00000-0000"
                    className={`h-11 text-sm ${
                      errors.telefone
                        ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {errors.telefone && (
                    <span className="mt-1 block text-[11px] text-red-500">
                      Digite um WhatsApp válido.
                    </span>
                  )}
                </div>

                <div>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                    required
                    placeholder="cliente@email.com"
                    className={`h-11 text-sm ${
                      errors.email
                        ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {errors.email && (
                    <span className="mt-1 block text-[11px] text-red-500">
                      Digite um e-mail válido.
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <PickerField
                      label="Estado"
                      value={estadoLabel}
                      placeholder="Selecionar"
                      onClick={() => setEstadoPickerOpen(true)}
                      required
                      error={errors.estado}
                    />
                    {errors.estado && (
                      <span className="mt-1 block text-[11px] text-red-500">
                        Selecione o estado.
                      </span>
                    )}
                  </div>

                  <div>
                    <PickerField
                      label="Cidade"
                      value={form.cidade}
                      placeholder={
                        loadingCidades
                          ? "Carregando..."
                          : form.estado
                          ? "Selecionar"
                          : "Escolha estado"
                      }
                      onClick={() => {
                        if (!form.estado || loadingCidades) return;
                        setCidadePickerOpen(true);
                      }}
                      required
                      error={errors.cidade}
                      disabled={!form.estado || loadingCidades}
                    />
                    {errors.cidade && (
                      <span className="mt-1 block text-[11px] text-red-500">
                        Selecione a cidade.
                      </span>
                    )}
                  </div>
                </div>

                {apiError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {apiError}
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Send size={16} className="shrink-0" />
                    <span className="leading-none">
                      {loading ? "GERANDO CORTESIA..." : "GERAR CORTESIA"}
                    </span>
                  </button>
                </div>
              </div>
            </Card>
          </form>
        </main>
      </div>

      <MobilePicker
        open={estadoPickerOpen}
        title="Selecione o estado"
        placeholderSearch="Buscar estado..."
        options={estadoOptions}
        selectedValue={form.estado}
        onClose={() => setEstadoPickerOpen(false)}
        onSelect={handleSelectEstado}
      />

      <MobilePicker
        open={cidadePickerOpen}
        title="Selecione a cidade"
        placeholderSearch="Buscar cidade..."
        options={cidadeOptions}
        selectedValue={form.cidade}
        onClose={() => setCidadePickerOpen(false)}
        onSelect={handleSelectCidade}
      />
    </>
  );
}