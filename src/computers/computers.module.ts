import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Computer } from './entities/computer.entity';
import { ComputersController } from './computers.controller';
import { ComputersService } from './computers.service';
import { ComputerLabsModule } from '../computer-labs/computer-labs.module'; // Import ComputerLabsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Computer]),
    ComputerLabsModule, // Import ComputerLabsModule
  ],
  controllers: [ComputersController],
  providers: [ComputersService],
})
export class ComputersModule {}