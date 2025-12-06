import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabSession } from './entities/lab-session.entity';
import { CreateLabSessionDto } from './dto/create-lab-session.dto';
import { UpdateLabSessionDto } from './dto/update-lab-session.dto';
import { ComputerLabsService } from '../computer-labs/computer-labs.service';

@Injectable()
export class LabSessionsService {
    constructor(
        @InjectRepository(LabSession)
        private readonly labSessionRepository: Repository<LabSession>,
        private readonly computerLabsService: ComputerLabsService,
    ) {}

    async create(
        createLabSessionDto: CreateLabSessionDto,
    ): Promise<LabSession> {
        const { labId, ...rest } = createLabSessionDto;
        const computerLab = await this.computerLabsService.findOne(labId); // Validate labId
        if (!computerLab) {
            throw new BadRequestException(
                `Computer Lab with ID "${labId}" not found`,
            );
        }
        const labSession = this.labSessionRepository.create({
            ...rest,
            labId: computerLab.labId,
        });
        return this.labSessionRepository.save(labSession);
    }

    findAll(): Promise<LabSession[]> {
        return this.labSessionRepository.find({ relations: ['computerLab'] });
    }

    async findByLabId(labId: string): Promise<LabSession[]> {
    const sessions = await this.labSessionRepository.find({
      where: { labId },
      relations: ['computerLab'], // Include lab details if needed
    });

    if (!sessions || sessions.length === 0) {
      throw new NotFoundException(
        `No Lab Sessions found for Lab ID "${labId}"`,
      );
    }

    return sessions;
  }

    async findOne(sessionId: string): Promise<LabSession> {
        const labSession = await this.labSessionRepository.findOne({
            where: { sessionId },
            relations: ['computerLab'],
        });
        if (!labSession) {
            throw new NotFoundException(
                `Lab Session with ID "${sessionId}" not found`,
            );
        }
        return labSession;
    }

    async update(
        sessionId: string,
        updateLabSessionDto: UpdateLabSessionDto,
    ): Promise<LabSession> {
        const { labId, ...rest } = updateLabSessionDto;
        if (labId) {
            const computerLab = await this.computerLabsService.findOne(labId);
            if (!computerLab) {
                throw new BadRequestException(
                    `Computer Lab with ID "${labId}" not found`,
                );
            }
        }

        const labSession = await this.labSessionRepository.preload({
            sessionId: sessionId,
            ...rest,
            ...(labId && { labId }), // Only update labId if provided
        });
        if (!labSession) {
            throw new NotFoundException(
                `Lab Session with ID "${sessionId}" not found`,
            );
        }
        return this.labSessionRepository.save(labSession);
    }

    async remove(sessionId: string): Promise<void> {
        const result = await this.labSessionRepository.delete(sessionId);
        if (result.affected === 0) {
            throw new NotFoundException(
                `Lab Session with ID "${sessionId}" not found`,
            );
        }
    }
}
