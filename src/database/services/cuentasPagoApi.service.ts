import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from '../database.service';

@Injectable()
export class CuentasPagoApiService {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}

  async create() {
    const results = await this.databaseService.execute(
      'SELECT * FROM CUENTAS_PAGOS_API',
    );
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
