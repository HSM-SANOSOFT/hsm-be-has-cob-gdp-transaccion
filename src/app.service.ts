import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from './database/database.service';
import { SolicitudPago } from './types';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}

  async createSolicitudPagon(payload: SolicitudPago) {
    const results = await this.databaseService.createSolicitudPagon();
  }
}
