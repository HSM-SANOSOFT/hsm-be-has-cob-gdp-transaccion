import { Injectable } from '@nestjs/common';

import { CuentasPagoApiService } from './services';

@Injectable()
export class DatabaseRepositories {
  constructor(public cuentasPagoApiService: CuentasPagoApiService) {}
}
