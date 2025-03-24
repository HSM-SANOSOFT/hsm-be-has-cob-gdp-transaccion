import { Module } from '@nestjs/common';

import { databaseProviders } from './database.provider';
import { DatabaseRepositories } from './database.repository';
import { DatabaseService } from './database.service';
import { DatabaseTableServices } from './services';

@Module({
  providers: [
    ...databaseProviders,
    DatabaseRepositories,
    DatabaseService,
    ...DatabaseTableServices,
  ],
  exports: [DatabaseService, DatabaseRepositories],
})
export class DatabaseModule {}
