import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabBookingController } from './lab-booking.controller';
import { LabBookingService } from './lab-booking.service';
import { LabBooking } from './entities/lab-booking.entity';
import { LabSession } from '../lab-sessions/entities/lab-session.entity';
import { Computer } from '../computers/entities/computer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LabBooking, LabSession, Computer])],
    controllers: [LabBookingController],
    providers: [LabBookingService],
})
export class LabBookingModule {}
