import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabBookingController } from './lab-booking.controller';
import { LabBookingService } from './lab-booking.service';
import { Booking } from './entities/booking.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ComputerModule } from '../computer/computer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    AuthModule,
    UserModule,
    ComputerModule,
  ],
  controllers: [LabBookingController],
  providers: [LabBookingService],
})
export class LabBookingModule {}
