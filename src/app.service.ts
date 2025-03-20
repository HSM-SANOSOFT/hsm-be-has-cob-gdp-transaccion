import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, Observable } from 'rxjs';

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
    const tax_value = amount_with_tax * envs.PORCENTAJE_IVA;
    const amount = amount_with_tax + amount_without_tax + tax_value;
    payload.valores = {
      ...payload.valores,
      tax_value,
      amount,
    };

    const valores = payload.valores;
    const { description, ...third } = payload.infoFactura;

    const pagosMediosApi: PagosMediosApiBody = {
      ...valores,
      third,
      description,
      generate_invoice: 0,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post<PagosMediosApiResponse>(envs.PAGOS_API_URL, pagosMediosApi)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new RpcException({
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Error calling Pagos API',
              error: error.response?.data || 'Unknown error',
            });
          }),
        ),
    );

    const token = data.data.token;
    const url = data.data.url;
    const createAtDate = new Date();

    const cuentasPago: CuentasPagoApiModel = {
      CREATEAT: createAtDate,
      UPDATEAT: createAtDate,
      TOKEN: token,
      ENLACE: url,
      ESTADO: 'A',
    };

    const results = data;
    await this.databaseRepositories.cuentasPagoApiService.create();
    return results;
  }
}
