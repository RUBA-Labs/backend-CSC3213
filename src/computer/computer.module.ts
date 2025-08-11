import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Computer } from './entities/computer.entity';
import { ComputerService } from './computer.service';
import { ComputerController } from './computer.controller';
import { Lab } from 'src/lab-allocation/entities/lab.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Computer, Lab])],
  controllers: [ComputerController],
  providers: [ComputerService],
  exports: [TypeOrmModule]
})
export class ComputerModule {}
