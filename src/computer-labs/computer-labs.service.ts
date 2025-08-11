import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComputerLab } from './entities/computer-lab.entity';
import { CreateComputerLabDto } from './dto/create-computer-lab.dto';
import { UpdateComputerLabDto } from './dto/update-computer-lab.dto';

@Injectable()
export class ComputerLabsService {
    constructor(
        @InjectRepository(ComputerLab)
        private readonly computerLabRepository: Repository<ComputerLab>,
    ) {}

    create(createComputerLabDto: CreateComputerLabDto): Promise<ComputerLab> {
        const computerLab = this.computerLabRepository.create(createComputerLabDto);
        return this.computerLabRepository.save(computerLab);
    }

    findAll(): Promise<ComputerLab[]> {
        return this.computerLabRepository.find();
    }

    async findOne(labId: string): Promise<ComputerLab> {
        const computerLab = await this.computerLabRepository.findOne({ where: { labId } });
        if (!computerLab) {
            throw new NotFoundException(`Computer Lab with ID "${labId}" not found`);
        }
        return computerLab;
    }

    async update(labId: string, updateComputerLabDto: UpdateComputerLabDto): Promise<ComputerLab> {
        const computerLab = await this.computerLabRepository.preload({
            labId: labId,
            ...updateComputerLabDto,
        });
        if (!computerLab) {
            throw new NotFoundException(`Computer Lab with ID "${labId}" not found`);
        }
        return this.computerLabRepository.save(computerLab);
    }

    async remove(labId: string): Promise<void> {
        const result = await this.computerLabRepository.delete(labId);
        if (result.affected === 0) {
            throw new NotFoundException(`Computer Lab with ID "${labId}" not found`);
        }
    }
}