import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { envs } from './config';
import { DatabaseRepositories } from './database/database.repository';
import { pagosMediosApi, SolicitudPago } from './types';

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

    const pagosMediosApi: pagosMediosApi = {
      ...valores,
      third,
      description,
      generate_invoice: 0,
    };

    const pagosMediosApiResponse = await this.httpService.post();

    const results =
      await this.databaseRepositories.cuentasPagoApiService.create();
    return results;
  }
}
