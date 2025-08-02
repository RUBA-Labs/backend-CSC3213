import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseTestService } from './database-test.service';
import { DatabaseTestController } from './database-test.controller';
import { DatabaseTest } from './entities/database-test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatabaseTest])],
  controllers: [DatabaseTestController],
  providers: [DatabaseTestService],
})
export class DatabaseTestModule {}
