import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DatabaseTestService } from './database-test.service';
import { CreateDatabaseTestDto } from './dto/create-database-test.dto';
import { UpdateDatabaseTestDto } from './dto/update-database-test.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Database Test')
@Controller('database-test')
export class DatabaseTestController {
  constructor(private readonly databaseTestService: DatabaseTestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new database test entry' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createDatabaseTestDto: CreateDatabaseTestDto) {
    return this.databaseTestService.create(createDatabaseTestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all database test entries' })
  @ApiResponse({ status: 200, description: 'Return all records.' })
  findAll() {
    return this.databaseTestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single database test entry by ID' })
  @ApiResponse({ status: 200, description: 'Return the record.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findOne(@Param('id') id: string) {
    return this.databaseTestService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a database test entry' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  update(
    @Param('id') id: string,
    @Body() updateDatabaseTestDto: UpdateDatabaseTestDto,
  ) {
    return this.databaseTestService.update(+id, updateDatabaseTestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a database test entry' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  remove(@Param('id') id: string) {
    return this.databaseTestService.remove(+id);
  }
}
