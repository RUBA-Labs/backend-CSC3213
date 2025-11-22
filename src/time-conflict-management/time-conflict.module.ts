
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeConflict } from './entities/time-conflict.entity';
import { AvailableSlot } from './entities/available-slot.entity';
import { TimeConflictManagementController } from './time-conflict-management.controller';
import { TimeConflictManagementService } from './time-conflict-management.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TimeConflict, AvailableSlot]), UserModule, AuthModule],
  controllers: [TimeConflictManagementController],
  providers: [TimeConflictManagementService],
})
export class TimeConflictManagementModule {}
