import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lab } from './entities/lab.entity';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';

@Injectable()
export class LabAllocationService {
    constructor(
        @InjectRepository(Lab)
        private readonly labRepository: Repository<Lab>,
    ) {}

    async createLab(createLabDto: CreateLabDto): Promise<Lab> {
        const lab = this.labRepository.create(createLabDto);
        return this.labRepository.save(lab);
    }

    async findAllLabs(): Promise<Lab[]> {
        return this.labRepository.find();
    }

    async findLabById(labId: number): Promise<Lab> {
        const lab = await this.labRepository.findOneBy({ labId });
        if (!lab) {
            throw new NotFoundException(`Lab with ID ${labId} not found`);
        }
        return lab;
    }

    async updateLab(labId: number, updateLabDto: UpdateLabDto): Promise<Lab> {
        const lab = await this.findLabById(labId);
        Object.assign(lab, updateLabDto);
        return this.labRepository.save(lab);
    }

    async deleteLab(labId: number): Promise<void> {
        const result = await this.labRepository.delete(labId);
        if (result.affected === 0) {
            throw new NotFoundException(`Lab with ID ${labId} not found`);
        }
    }
}

