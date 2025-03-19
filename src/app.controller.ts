import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SolicitudPago } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('solicitudPago')
  getLink(
    @Payload()
    payload: SolicitudPago,
  ) {
    const response = {
      status: 'Active',
      token: 'chabchd015Flgfsed',
      url: 'https://payurl.link/ZTR3638000',
      validTo: new Date(),
      createdAt: new Date(),
      updateAt: new Date(),
    };
    throw new RpcException({
      statusCode: 501,
      message: 'Error en la solicitud de pago',
      data: 's',
    });
    //return response;
  }
}
