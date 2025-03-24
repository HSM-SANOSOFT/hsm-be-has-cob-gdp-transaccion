import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '../database.service';
import { CuentasPagoApiModel } from '../models';

@Injectable()
export class CuentasPagoApiService {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CuentasPagoApiModel) {
    const results = await this.databaseService.execute(
      'INSERT INTO CUENTAS_PAGOS_API (CREATEAT, UPDATEAT, PROVEEDOR, TOKEN, ENLACE, COMPANIA, ESTADO, DESCRIPCION_SERVICIO, DETALLE_FACTURACION, VALIDO) VALUES (:CREATEAT, :UPDATEAT, :PROVEEDOR, :TOKEN, :ENLACE, :COMPANIA, :ESTADO, :DESCRIPCION_SERVICIO, :DETALLE_FACTURACION, :VALIDO)',
      { ...data },
    );
    return results;
  }

  async update() {
    //const results = await this.databaseService.execute()
  }

  async delete() {
    //const results = await this.databaseService.execute()
  }

  async getOne() {
    //const results = await this.databaseService.execute()
  }

  async getMany() {
    //const results = await this.databaseService.execute()
  }
}
