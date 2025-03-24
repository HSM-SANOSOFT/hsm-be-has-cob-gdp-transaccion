export type PagosMediosApiBody = {
  integration: true;
  generate_invoice: 0;
  third: {
    document: string;
    document_type: '04' | '05' | '06' | '08'; // RUC|Cédula ecuatoriana|Pasaporte|Identificación del exterior
    name: string;
    email: string;
    phones: string;
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
  has_cards: 0 | 1;
  has_de_una: 0 | 1;
  has_paypal: 0 | 1;
  has_safetypay: boolean;
  platform_settings?: [
    {
      platform: 'safetypay';
      settings: Array<{
        country_code: 'ECU';
        channel_type: number;
        include_all_banks: boolean;
      }>;
    },
  ];
};

export type PagosMediosApiResponse = {
  success: boolean;
  status: number;
  data: {
    url: string;
    token: string;
  };
};
