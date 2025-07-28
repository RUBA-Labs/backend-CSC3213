import { Injectable } from '@nestjs/common';
import { CreateDatabaseTestDto } from './dto/create-database-test.dto';
import { UpdateDatabaseTestDto } from './dto/update-database-test.dto';

@Injectable()
export class DatabaseTestService {
  create(createDatabaseTestDto: CreateDatabaseTestDto) {
    return 'This action adds a new databaseTest';
  }

  findAll() {
    return `This action returns all databaseTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} databaseTest`;
  }

  update(id: number, updateDatabaseTestDto: UpdateDatabaseTestDto) {
    return `This action updates a #${id} databaseTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} databaseTest`;
  }
}
