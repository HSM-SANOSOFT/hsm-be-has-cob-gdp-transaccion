import { Module } from '@nestjs/common';

import { databaseProviders } from './database.provider';
import { DatabaseRepositories } from './database.repository';
import { DatabaseService } from './database.service';

@Module({
  providers: [...databaseProviders, DatabaseRepositories, DatabaseService],
  exports: [DatabaseService, DatabaseRepositories],
})
export class DatabaseModule {}
