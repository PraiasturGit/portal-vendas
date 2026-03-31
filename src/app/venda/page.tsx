"use client";
import Cookies from "js-cookie";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/service/api";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

import { StepContrato } from "./steps/StepContrato";
import { StepTitular } from "./steps/StepTitular";
import { StepCoTitular } from "./steps/StepCoTitular";
import { StepDependentes } from "./steps/StepDependentes";
import { StepEndereco } from "./steps/StepEndereco";
import { StepPagamento } from "./steps/StepPagamento";
import { StepRevisao } from "./steps/StepRevisao";
import { VendaFormData } from "./types";

const STEPS_LABELS = [
  "Contrato",
  "Titular",
  "Co-Titular",
  "Dependentes",
  "Endereço",
  "Pagamento",
  "Revisão",
];

function makeRequestId() {
  try {
    // @ts-ignore
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {}
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function isFilled(value: unknown) {
  return String(value ?? "").trim() !== "";
}

function parseMoneyLike(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;

  const cleaned = value
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function VendaPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const sendingRef = useRef(false);
  const requestIdRef = useRef<string>(makeRequestId());

  const [formData, setFormData] = useState<VendaFormData>({
    tipoVenda: "Presencial",
    tipoContratoNome: "Ouro",
    tipoEntrada: "COM_ENTRADA",
    numeroContrato: "",
    valorTotalPlano: "",
    nomeTitular: "",
    cpfTitular: "",
    rgTitular: "",
    telefoneTitular: "",
    emailTitular: "",
    dataNascimentoTitular: "",
    estadoCivilTitular: "",
    profissaoTitular: "",
    sexoTitular: "Masculino",
    nomeCoTitular: "",
    cpfCoTitular: "",
    rgCoTitular: "",
    telefoneCoTitular: "",
    emailCoTitular: "",
    dataNascimentoCoTitular: "",
    profissaoCoTitular: "",
    sexoCoTitular: "Feminino",

    // Dependentes
    nomeDependente1: "",
    cpfDependente1: "",
    parentescoDependente1: "",
    telefoneDependente1: "",
    dataNascimentoDependente1: "",
    nomeDependente2: "",
    cpfDependente2: "",
    parentescoDependente2: "",
    telefoneDependente2: "",
    dataNascimentoDependente2: "",
    nomeDependente3: "",
    cpfDependente3: "",
    parentescoDependente3: "",
    telefoneDependente3: "",
    dataNascimentoDependente3: "",
    nomeDependente4: "",
    cpfDependente4: "",
    parentescoDependente4: "",
    telefoneDependente4: "",
    dataNascimentoDependente4: "",

    // Endereço e Pagamento
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    formaDePagamentoNome: "Cartão de Crédito",
    valorEntrada: "",
    formaDePagamentoEntradaNome: "Pix",
    valorParcela: "",
    detalhesParcelamento: "",
    obsPagamento: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validarStepAtual = () => {
    // STEP 1 - TITULAR
    if (currentStep === 1) {
      if (!isFilled(formData.nomeTitular)) {
        toast.error("Preencha o nome do titular.");
        return false;
      }

      if (!isFilled(formData.cpfTitular)) {
        toast.error("Preencha o CPF do titular.");
        return false;
      }

      if (!isFilled(formData.telefoneTitular)) {
        toast.error("Preencha o telefone do titular.");
        return false;
      }

      if (!isFilled(formData.emailTitular)) {
        toast.error("Preencha o e-mail do titular.");
        return false;
      }

      if (!isFilled(formData.dataNascimentoTitular)) {
        toast.error("Preencha a data de nascimento do titular.");
        return false;
      }

      if (!isFilled(formData.estadoCivilTitular)) {
        toast.error("Preencha o estado civil do titular.");
        return false;
      }

      if (!isFilled(formData.profissaoTitular)) {
        toast.error("Preencha a profissão do titular.");
        return false;
      }
    }

    // STEP 4 - ENDEREÇO
    if (currentStep === 4) {
      if (!isFilled(formData.cep)) {
        toast.error("Preencha o CEP.");
        return false;
      }

      if (!isFilled(formData.rua)) {
        toast.error("Preencha a rua e o número.");
        return false;
      }

      if (!isFilled(formData.bairro)) {
        toast.error("Preencha o bairro.");
        return false;
      }

      if (!isFilled(formData.cidade)) {
        toast.error("Preencha a cidade.");
        return false;
      }

      if (!isFilled(formData.estado)) {
        toast.error("Preencha o estado.");
        return false;
      }
    }

    // STEP 5 - PAGAMENTO
    if (currentStep === 5) {
      if (!isFilled(formData.tipoContratoNome)) {
        toast.error("Selecione o plano.");
        return false;
      }

      const tipoEntrada = String(formData.tipoEntrada || "COM_ENTRADA").toUpperCase();
      const valorEntrada = parseMoneyLike(formData.valorEntrada);

      if (tipoEntrada === "COM_ENTRADA") {
        if (!isFilled(formData.valorEntrada) || !Number.isFinite(valorEntrada) || valorEntrada <= 0) {
          toast.error("Informe uma entrada maior que zero.");
          return false;
        }

        if (!isFilled(formData.formaDePagamentoEntradaNome)) {
          toast.error("Selecione a forma de pagamento da entrada.");
          return false;
        }
      }

      if (!isFilled(formData.valorTotalPlano)) {
        toast.error("Selecione uma opção na tabela do plano.");
        return false;
      }

      if (!isFilled(formData.formaDePagamentoNome)) {
        toast.error("Selecione a forma de pagamento do plano.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    const podeAvancar = validarStepAtual();
    if (!podeAvancar) return;

    setCurrentStep((prev) => Math.min(prev + 1, STEPS_LABELS.length - 1));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const processarEnvio = async (gerarContrato: boolean) => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setLoading(true);

    try {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("Sessão expirada! Faça login novamente.");
        router.push("/login");
        return;
      }

      const payload: any = {
        ...formData,
        numeroContrato: "",
        gerarContrato,
        requestId: requestIdRef.current,
      };

      const { data } = await api.post("/api/vendas/criar-analise", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": requestIdRef.current,
        },
      });

      if (gerarContrato) {
        if (data.clickSignSucesso === false) {
          toast.warning("Venda salva, mas o contrato falhou!", {
            description: `Motivo: ${data.clickSignErro || "Erro na Clicksign"}`,
            duration: 6000,
          });
        } else {
          toast.success("Venda salva!", {
            description: "O contrato foi enviado para o WhatsApp do cliente.",
            duration: 4000,
          });
        }
      } else {
        toast.success("Venda registrada!", {
          description: "Salvo com sucesso (Contrato manual).",
          duration: 4000,
        });
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao processar venda.";

      toast.error("Erro ao finalizar", {
        description: msg,
      });

      requestIdRef.current = makeRequestId();
    } finally {
      setLoading(false);
      sendingRef.current = false;
    }
  };

  const renderStep = () => {
    const props = { formData, handleChange, setFormData };

    switch (currentStep) {
      case 0:
        return <StepContrato {...props} />;
      case 1:
        return <StepTitular {...props} />;
      case 2:
        return <StepCoTitular {...props} />;
      case 3:
        return <StepDependentes {...props} />;
      case 4:
        return <StepEndereco {...props} />;
      case 5:
        return <StepPagamento {...props} />;
      case 6:
        return <StepRevisao formData={formData} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS_LABELS.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <div className="bg-white shadow-sm sticky top-0 z-10 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Nova Venda</h1>
          <div className="text-sm text-gray-500 font-medium">
            Passo {currentStep + 1} de {STEPS_LABELS.length}:{" "}
            <span className="text-blue-600">{STEPS_LABELS[currentStep]}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 h-1.5 mt-4">
          <div
            className="bg-blue-600 h-1.5 transition-all duration-300 ease-in-out"
            style={{
              width: `${((currentStep + 1) / STEPS_LABELS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">{renderStep()}</main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="w-32">
            {currentStep > 0 && (
              <Button
                onClick={handlePrev}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
            )}
          </div>

          <div className="w-auto md:w-auto">
            {isLastStep ? (
              <Button
                onClick={() => {
                  // @ts-ignore
                  const deveGerar = formData.tipoEnvioContrato === "Digital";
                  processarEnvio(Boolean(deveGerar));
                }}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 w-full md:w-48"
              >
                {loading ? (
                  <span className="flex items-center gap-2">Processando...</span>
                ) : (
                  <span className="flex items-center gap-2">
                    Finalizar Venda <CheckCircle size={18} />
                  </span>
                )}
              </Button>
            ) : (
              <Button onClick={handleNext} className="w-32" disabled={loading}>
                Próximo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
