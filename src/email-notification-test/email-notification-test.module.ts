import { Module } from '@nestjs/common';
import { EmailNotificationTestService } from './email-notification-test.service';
import { EmailNotificationTestController } from './email-notification-test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([EmailLog]), ConfigModule],
  controllers: [EmailNotificationTestController],
  providers: [EmailNotificationTestService],
})
export class EmailNotificationTestModule {}
