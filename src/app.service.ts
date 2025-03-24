import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { envs } from './config';
import { DatabaseRepositories } from './database/database.repository';
import { CuentasPagoApiModel } from './database/models';
import {
  PagosMediosApiBody,
  PagosMediosApiResponse,
  SolicitudPago,
} from './types';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(
    private readonly databaseRepositories: DatabaseRepositories,
    private readonly httpService: HttpService,
  ) {}

  async createSolicitudPagon(payload: SolicitudPago) {
    const { amount_with_tax, amount_without_tax } = payload.valores;
    const tax_value = parseFloat(
      (amount_with_tax * envs.PORCENTAJE_IVA).toFixed(2),
    );
    const amount: number = parseFloat(
      (amount_with_tax + amount_without_tax + tax_value).toFixed(2),
    );
    payload.valores = {
      ...payload.valores,
      tax_value,
      amount,
    };

    const valores = payload.valores;
    const { description, ...third } = payload.infoFactura;

    const compania = payload.detalle.compania;

    let bearerToken: string;
    let has_safetypay: boolean;

    switch (compania) {
      case 'SAS':
        bearerToken = envs.PAGOS_API_TOKEN_CS;
        has_safetypay = true;
        break;
      case 'HSM':
        bearerToken = envs.PAGOS_API_TOKEN_SS;
        has_safetypay = true;
        break;
      default:
        bearerToken = envs.PAGOS_API_TOKEN_TS;
        has_safetypay = false;
        break;
    }

    const pagosMediosApiBody: PagosMediosApiBody = {
      integration: true,
      ...valores,
      third,
      description,
      generate_invoice: 0,
      settings: [],
      has_cards: 1,
      has_de_una: 0,
      has_paypal: 0,
      has_safetypay,
      platform_settings: [
        {
          platform: 'safetypay',
          settings: [
            {
              country_code: 'ECU',
              channel_type: 1,
              include_all_banks: true,
            },
            {
              country_code: 'ECU',
              channel_type: 2,
              include_all_banks: true,
            },
          ],
        },
      ],
    };

    const pagosMediosApiUrl = `${envs.PAGOS_API_URL}/payment-requests`;

    const { data } = await firstValueFrom(
      this.httpService
        .post<PagosMediosApiResponse>(pagosMediosApiUrl, pagosMediosApiBody, {
          headers: { Authorization: `Bearer ${bearerToken}` },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new RpcException({
              statusCode: error.response?.status,
              message: error.response?.data || 'Unknown error',
            });
          }),
        ),
    );

    const token = data.data.token;
    const url = data.data.url;
    const createAtDate = new Date();
    const validoDate = new Date(createAtDate.getTime() + 12 * 60 * 60 * 1000);
    const descripcionServicio = JSON.stringify(payload.detalle);
    const descripcionFacturacion = JSON.stringify(payload.infoFactura);

    const cuentasPago: CuentasPagoApiModel = {
      COMPANIA: compania,
      TOKEN: token,
      ENLACE: url,
      ESTADO: 'A',
      VALIDO: validoDate,
      PROVEEDOR: 'Pagos Medios',
      DESCRIPCION_SERVICIO: descripcionServicio,
      DETALLE_FACTURACION: descripcionFacturacion,
      CREATEAT: createAtDate,
      UPDATEAT: createAtDate,
    };

    console.log(cuentasPago);

    const results = cuentasPago;
    //await this.databaseRepositories.cuentasPagoApiService.create();
    return results;
  }
}
