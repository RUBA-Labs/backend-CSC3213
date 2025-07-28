import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatabaseTestService } from './database-test.service';
import { CreateDatabaseTestDto } from './dto/create-database-test.dto';
import { UpdateDatabaseTestDto } from './dto/update-database-test.dto';

@Controller('database-test')
export class DatabaseTestController {
  constructor(private readonly databaseTestService: DatabaseTestService) {}

  @Post()
  create(@Body() createDatabaseTestDto: CreateDatabaseTestDto) {
    return this.databaseTestService.create(createDatabaseTestDto);
  }

  @Get()
  findAll() {
    return this.databaseTestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.databaseTestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDatabaseTestDto: UpdateDatabaseTestDto) {
    return this.databaseTestService.update(+id, updateDatabaseTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.databaseTestService.remove(+id);
  }
}
