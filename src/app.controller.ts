import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SolicitudPago } from './types';

@Controller()
export class AppController {
  private readonly logger = new Logger();
  constructor(private readonly appService: AppService) {}

  @MessagePattern('webhook')
  webhook() {
    return 'Hello World!';
  }

  @MessagePattern('createSolicitudPago')
  async createSolicitudPago(
    @Payload()
    payload: SolicitudPago,
  ) {
    const result = await this.appService.createSolicitudPago(payload);
    this.logger.log('createSolicitudPago: ', result);
    return result;
  }
}
