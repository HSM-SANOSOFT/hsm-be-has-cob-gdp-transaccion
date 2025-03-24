import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SolicitudPago } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('createSolicitudPago')
  async createSolicitudPago(
    @Payload()
    payload: SolicitudPago,
  ) {
    return await this.appService.createSolicitudPago(payload);
  }
}
