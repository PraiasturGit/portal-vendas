// app/(dashboard)/vendas/nova/steps/StepContrato.tsx  (ajuste o caminho se necessário)
// ✅ Arquivo COMPLETO pronto pra copiar e colar
import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StepProps } from "../types";
import { ModalDecisaoVenda } from "@/components/ModalDecisaoVenda";

export function StepContrato({ formData, handleChange, setFormData }: StepProps) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // se ainda não escolheu o modo, abre modal
    if (!formData.tipoEnvioContrato) {
      setShowModal(true);
    }
    // ✅ NÃO buscar "proximo numero" aqui.
    // O número oficial agora é gerado SOMENTE no backend ao finalizar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDecisaoModal = (gerarDigital: boolean) => {
    if (!setFormData) return;

    const tipoEnvio = gerarDigital ? "Digital" : "Manual";

    setFormData((prev) => ({
      ...prev,
      tipoEnvioContrato: tipoEnvio,

      // ✅ Digital: deixa vazio e bloqueia edição (backend gera ao finalizar)
      // ✅ Manual: permite digitar
      numeroContrato: gerarDigital ? "" : prev.numeroContrato || "",

      // ✅ Se for digital, força Online (igual você já fazia)
      tipoVenda: gerarDigital ? "Online" : prev.tipoVenda,
    }));

    setShowModal(false);
  };

  const isDigital = formData.tipoEnvioContrato === "Digital";

  return (
    <>
      <ModalDecisaoVenda
        isOpen={showModal}
        loading={false} // ✅ não tem mais loading de número
        onClose={() => {}}
        onConfirm={handleDecisaoModal}
      />

      <Card>
        <CardHeader title="Dados Iniciais" subtitle="Identificação do documento" />

        <div className="px-6 pb-2 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
            type="button"
          >
            Alterar modo ({isDigital ? "Gerar Automático" : "Digitar Manual"})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Número do Contrato"
            name="numeroContrato"
            value={formData.numeroContrato || ""}
            onChange={handleChange}
            required={!isDigital} // ✅ Digital não precisa preencher no front
            readOnly={isDigital}
            disabled={isDigital}
            className={isDigital ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            placeholder={isDigital ? "Será gerado automaticamente na finalização" : "Digite o número"}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Modalidade da Venda</label>
            <select
              name="tipoVenda"
              value={formData.tipoVenda || ""}
              onChange={handleChange}
              disabled={isDigital}
              className={`w-full border p-2.5 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                isDigital ? "bg-gray-100 cursor-not-allowed" : "bg-white"
              }`}
              required
            >
              <option value="" disabled>
                Selecione...
              </option>
              <option value="Online">Online</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
        </div>

        {/* ✅ Informação clara pro usuário */}
        {isDigital && (
          <div className="px-6 pb-4 pt-2">
            <p className="text-xs text-gray-500">
              No modo <b>Digital</b>, o número do contrato é definido automaticamente pelo sistema no momento em que você
              clicar em <b>Finalizar Venda</b>.
            </p>
          </div>
        )}
      </Card>
    </>
  );
}
