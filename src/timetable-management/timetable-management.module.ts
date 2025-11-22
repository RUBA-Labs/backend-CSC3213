
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableManagementController } from './timetable-management.controller';
import { TimetableManagementService } from './timetable-management.service';
import { Schedule } from './entities/schedule.entity';
import { Room } from './entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Room])],
  controllers: [TimetableManagementController],
  providers: [TimetableManagementService],
})
export class TimetableManagementModule {}
