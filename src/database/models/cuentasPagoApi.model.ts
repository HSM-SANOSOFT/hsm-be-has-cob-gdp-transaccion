// 'CUENTAS_PAGOS_API'
export class CuentasPagoApiModel {
  constructor(
    public NUMERO: string,
    public CREATEAT: Date,
    public UPDATEAT: Date,
    public PROVEEDOR: string,
    public TOKEN: string,
    public ENLACE: string,
    public COMPANIA: string,
    public ESTADO: string,
    public FORMA_DE_PAGO: string,
    public DESCRIPCION_SERVICIO: string,
    public DETALLE_FACTURACION: string,
    public VALIDO: Date,
  ) {}
}
