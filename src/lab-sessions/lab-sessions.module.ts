import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabSession } from './entities/lab-session.entity';
import { LabSessionsController } from './lab-sessions.controller';
import { LabSessionsService } from './lab-sessions.service';
import { ComputerLabsModule } from '../computer-labs/computer-labs.module'; // Import ComputerLabsModule

@Module({
    imports: [
        TypeOrmModule.forFeature([LabSession]),
        ComputerLabsModule, // Import ComputerLabsModule
    ],
    controllers: [LabSessionsController],
    providers: [LabSessionsService],
})
export class LabSessionsModule {}
