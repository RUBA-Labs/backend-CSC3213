import { Module } from '@nestjs/common';
import { LabAllocationService } from './lab-allocation.service';
import { LabAllocationController } from './lab-allocation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lab } from './entities/lab.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lab])],
  controllers: [LabAllocationController],
  providers: [LabAllocationService],
})
export class LabAllocationModule {}
