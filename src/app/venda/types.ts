export interface VendaFormData {
  // --- Contrato ---
  numeroContrato: string;
  tipoContratoNome: string;
  valorTotalPlano: string;
  tipoVenda: string;

  // --- Regra da negociação ---
  tipoEntrada: "COM_ENTRADA" | "SEM_ENTRADA" | "ISENTA";
  valorSaldo?: string;
  ajustarParcelasPlano?: boolean;

  // --- Tipo envio contrato ---
  tipoEnvioContrato?: "Digital" | "Manual";

  // --- Titular ---
  nomeTitular: string;
  cpfTitular: string;
  rgTitular: string;
  sexoTitular: string;
  dataNascimentoTitular: string;
  telefoneTitular: string;
  estadoCivilTitular: string;
  profissaoTitular: string;
  emailTitular: string;

  // --- Co-Titular ---
  nomeCoTitular: string;
  cpfCoTitular: string;
  rgCoTitular: string;
  sexoCoTitular: string;
  dataNascimentoCoTitular: string;
  telefoneCoTitular: string;
  emailCoTitular: string;
  profissaoCoTitular: string;

  // --- Endereço ---
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;

  // --- Financeiro ---
  valorEntrada: string;
  formaDePagamentoEntradaNome: string;
  valorParcela: string;
  formaDePagamentoNome: string;
  detalhesParcelamento: string;
  obsPagamento: string;

  // --- Dinâmico ---
  [key: string]: any;

  // --- Evento ---
  evento?: string;
}

export interface StepProps {
  formData: VendaFormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<VendaFormData>>;
}
