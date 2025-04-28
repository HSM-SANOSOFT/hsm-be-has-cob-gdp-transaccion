import { Injectable } from '@nestjs/common';

import { CuentasPagoApiService } from './repositories';

@Injectable()
export class DatabaseRepository {
  constructor(public cuentasPagoApiService: CuentasPagoApiService) {}
}
