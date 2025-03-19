import { Injectable, Logger } from '@nestjs/common';

import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger();
  constructor(private readonly databaseService: DatabaseService) {}
}
