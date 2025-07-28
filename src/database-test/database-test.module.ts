import { Module } from '@nestjs/common';
import { DatabaseTestService } from './database-test.service';
import { DatabaseTestController } from './database-test.controller';

@Module({
  controllers: [DatabaseTestController],
  providers: [DatabaseTestService],
})
export class DatabaseTestModule {}
