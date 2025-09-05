import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerLab } from './entities/computer-lab.entity';
import { ComputerLabsController } from './computer-labs.controller';
import { ComputerLabsService } from './computer-labs.service';

@Module({
    imports: [TypeOrmModule.forFeature([ComputerLab])],
    controllers: [ComputerLabsController],
    providers: [ComputerLabsService],
    exports: [ComputerLabsService],
})
export class ComputerLabsModule {}
