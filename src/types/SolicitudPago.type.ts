export type SolicitudPago = {
  infoFactura: {
    document: string;
    document_type:
      | '04' /* RUC */
      | '05' /* Cédula ecuatoriana */
      | '06' /* Pasaporte */
      | '08' /* Identificación del exterior */;
    name: string;
    email: string;
    phone: string;
    address: string;
    type: 'Individual' /* Persona natural */ | 'Company' /* Empresa */;
  };
  valores: {
    amount_without_tax: number;
    tax_value: number;
  };
  detalle: {
    tipo: string;
    data: {
      [key: string]: unknown;
    };
  };
};
