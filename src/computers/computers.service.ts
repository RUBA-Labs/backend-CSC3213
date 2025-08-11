import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Computer } from './entities/computer.entity';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { ComputerLabsService } from '../computer-labs/computer-labs.service';

@Injectable()
export class ComputersService {
    constructor(
        @InjectRepository(Computer)
        private readonly computerRepository: Repository<Computer>,
        private readonly computerLabsService: ComputerLabsService,
    ) {}

    async create(createComputerDto: CreateComputerDto): Promise<Computer> {
        const { labId, ...rest } = createComputerDto;
        const computerLab = await this.computerLabsService.findOne(labId); // Validate labId
        if (!computerLab) {
            throw new BadRequestException(`Computer Lab with ID "${labId}" not found`);
        }
        const computer = this.computerRepository.create({ ...rest, labId: computerLab.labId });
        return this.computerRepository.save(computer);
    }

    findAll(): Promise<Computer[]> {
        return this.computerRepository.find({ relations: ['computerLab'] });
    }

    async findOne(computerId: string): Promise<Computer> {
        const computer = await this.computerRepository.findOne({
            where: { computerId },
            relations: ['computerLab'],
        });
        if (!computer) {
            throw new NotFoundException(`Computer with ID "${computerId}" not found`);
        }
        return computer;
    }

    async update(computerId: string, updateComputerDto: UpdateComputerDto): Promise<Computer> {
        const { labId, ...rest } = updateComputerDto;
        if (labId) {
            const computerLab = await this.computerLabsService.findOne(labId);
            if (!computerLab) {
                throw new BadRequestException(`Computer Lab with ID "${labId}" not found`);
            }
        }

        const computer = await this.computerRepository.preload({
            computerId: computerId,
            ...rest,
            ...(labId && { labId }), // Only update labId if provided
        });
        if (!computer) {
            throw new NotFoundException(`Computer with ID "${computerId}" not found`);
        }
        return this.computerRepository.save(computer);
    }

    async remove(computerId: string): Promise<void> {
        const result = await this.computerRepository.delete(computerId);
        if (result.affected === 0) {
            throw new NotFoundException(`Computer with ID "${computerId}" not found`);
        }
    }
}