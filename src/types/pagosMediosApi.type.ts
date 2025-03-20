export type PagosMediosApiBody = {
  generate_invoice: 0;
  third: {
    document: string;
    document_type:
      | '04' // RUC
      | '05' // Cédula ecuatoriana
      | '06' // Pasaporte
      | '08'; // Identificación del exterior
    name: string;
    email: string;
    phone: string;
    address: string;
    type: 'Individual' | 'Company'; // Persona natural o Empresa
  };
  description: string;
  amount: number;
  amount_with_tax: number;
  amount_without_tax: number;
  tax_value: number;
  notify_url?: string;
  settings?: [];
  custome_values?: string;
  has_card?: 0 | 1;
  has_paypal?: 0 | 1;
  has_safetypay?: 0 | 1;
  platform_settings?: [];
};

export type PagosMediosApiResponse = {
  success: boolean;
  status: number;
  data: {
    url: string;
    token: string;
  };
};
