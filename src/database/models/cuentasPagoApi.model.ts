// 'CUENTAS_PAGOS_API'
export class CuentasPagoApiModel {
  constructor(
    public CREATEAT: Date,
    public UPDATEAT: Date,
    public PROVEEDOR: string,
    public TOKEN: string,
    public ENLACE: string,
    public COMPANIA: 'SAS' | 'CSI',
    public ESTADO: 0 | 1 | 2 | 3, // 0: Generado, 1: Enviado, 2: Pagado, 3: Facturado
    public DESCRIPCION_SERVICIO: string,
    public VALIDO: Date,
    public NUMERO?: string,
    public FORMA_DE_PAGO?: string,
    public DETALLE_FACTURACION?: string,
  ) {}
}
