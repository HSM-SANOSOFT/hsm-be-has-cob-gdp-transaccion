import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { envs } from './config';
import { DatabaseRepository } from './database/database.repository';
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
    private readonly databaseRepository: DatabaseRepository,
    private readonly httpService: HttpService,
  ) {}

  async createSolicitudPago(payload: SolicitudPago) {
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
        this.logger.log('SAS');
        bearerToken = envs.PAGOS_API_TOKEN_SS;
        has_safetypay = false;
        break;
      case 'CSI':
        this.logger.log('CSI');
        bearerToken = envs.PAGOS_API_TOKEN_CS;
        has_safetypay = false;
        break;
      default:
        this.logger.log('default');
        bearerToken = envs.PAGOS_API_TOKEN_SS;
        has_safetypay = false;
        break;
    }
    this.logger.debug(`Bearer Token: ${bearerToken}`);

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
      notify_url:
        payload.configuracion?.notify_url ||
        'https://hospitalsm.org/v2/webhook/pagos-medios',
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
            this.logger.error(JSON.stringify(error.cause || error.message));
            throw new RpcException({
              statusCode: error.status,
              message: error.cause || error.message,
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
      ESTADO: 0,
      VALIDO: validoDate,
      PROVEEDOR: 'Pagos Medios',
      DESCRIPCION_SERVICIO: descripcionServicio,
      DETALLE_FACTURACION: descripcionFacturacion,
      CREATEAT: createAtDate,
      UPDATEAT: createAtDate,
    };

    await this.databaseRepository.cuentasPagoApiService.create(cuentasPago);

    const response = {
      TOKEN: token,
      ENLACE: url,
      VALIDO: validoDate,
    };
    return response;
  }
}
