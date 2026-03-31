export interface VendaFormData {
  // --- Contrato ---
  numeroContrato: string;
  tipoContratoNome: string;
  valorTotalPlano: string;
  valorTotal?: string;
  tipoVenda: string;

  // --- Regra da negociação ---
  tipoEntrada: "COM_ENTRADA" | "SEM_ENTRADA" | "ISENTA";
  valorSaldo?: string;
  ajustarParcelasPlano?: boolean;

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
  valorParcela: string; // legado: detalhes da entrada
  formaDePagamentoNome: string; // pagamento do plano
  detalhesParcelamento: string;
  obsPagamento: string;

  // --- Dependentes / extras dinâmicos ---
  [key: string]: string | number | boolean | undefined;
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
