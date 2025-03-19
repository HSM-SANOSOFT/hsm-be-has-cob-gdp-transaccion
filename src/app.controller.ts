import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SolicitudPago } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('createSolicitudPagon')
  async createSolicitudPagon(
    @Payload()
    payload: SolicitudPago,
  ) {
    return await this.appService.createSolicitudPagon(payload);
  }
}
