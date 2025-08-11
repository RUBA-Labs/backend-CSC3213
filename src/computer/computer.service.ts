import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Computer } from './entities/computer.entity';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { Lab } from 'src/lab-allocation/entities/lab.entity';

@Injectable()
export class ComputerService {
    constructor(
        @InjectRepository(Computer)
        private readonly computerRepository: Repository<Computer>,
        @InjectRepository(Lab)
        private readonly labRepository: Repository<Lab>,
    ) {}

    async create(createComputerDto: CreateComputerDto): Promise<Computer> {
        const lab = await this.labRepository.findOneBy({ labId: createComputerDto.labId });
        if (!lab) {
            throw new NotFoundException(`Lab with ID ${createComputerDto.labId} not found`);
        }

        const computer = this.computerRepository.create({
            ...createComputerDto,
            lab,
        });

        return this.computerRepository.save(computer);
    }

    async findAll(): Promise<Computer[]> {
        return this.computerRepository.find({ relations: ['lab'] });
    }

    async findAllByLab(labId: number): Promise<Computer[]> {
        return this.computerRepository.find({ where: { labId }, relations: ['lab'] });
    }

    async findOne(id: number): Promise<Computer> {
        const computer = await this.computerRepository.findOne({ where: { id }, relations: ['lab'] });
        if (!computer) {
            throw new NotFoundException(`Computer with ID ${id} not found`);
        }
        return computer;
    }

    async update(id: number, updateComputerDto: UpdateComputerDto): Promise<Computer> {
        const computer = await this.findOne(id);
        Object.assign(computer, updateComputerDto);
        return this.computerRepository.save(computer);
    }

    async remove(id: number): Promise<void> {
        const result = await this.computerRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Computer with ID ${id} not found`);
        }
    }
}
