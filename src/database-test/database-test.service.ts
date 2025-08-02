import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDatabaseTestDto } from './dto/create-database-test.dto';
import { UpdateDatabaseTestDto } from './dto/update-database-test.dto';
import { DatabaseTest } from './entities/database-test.entity';

@Injectable()
export class DatabaseTestService {
  constructor(
    @InjectRepository(DatabaseTest)
    private readonly databaseTestRepository: Repository<DatabaseTest>,
  ) {}

  create(createDatabaseTestDto: CreateDatabaseTestDto): Promise<DatabaseTest> {
    const databaseTest = this.databaseTestRepository.create(createDatabaseTestDto);
    return this.databaseTestRepository.save(databaseTest);
  }

  findAll(): Promise<DatabaseTest[]> {
    return this.databaseTestRepository.find();
  }

  async findOne(id: number): Promise<DatabaseTest> {
    const databaseTest = await this.databaseTestRepository.findOneBy({ id });
    if (!databaseTest) {
      throw new NotFoundException(`DatabaseTest with ID ${id} not found`);
    }
    return databaseTest;
  }

  async update(id: number, updateDatabaseTestDto: UpdateDatabaseTestDto): Promise<DatabaseTest> {
    const databaseTest = await this.databaseTestRepository.findOneBy({ id });
    if (!databaseTest) {
      throw new NotFoundException(`DatabaseTest with ID ${id} not found`);
    }
    Object.assign(databaseTest, updateDatabaseTestDto);
    return this.databaseTestRepository.save(databaseTest);
  }

  async remove(id: number): Promise<void> {
    const databaseTest = await this.databaseTestRepository.findOneBy({ id });
    if (!databaseTest) {
      throw new NotFoundException(`DatabaseTest with ID ${id} not found`);
    }
    await this.databaseTestRepository.remove(databaseTest);
  }
}