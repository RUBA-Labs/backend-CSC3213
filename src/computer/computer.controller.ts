import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ComputerService } from './computer.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Computers')
@ApiBearerAuth()
@Controller('computers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComputerController {
  constructor(private readonly computerService: ComputerService) {}

  @Post()
  @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Create a new computer' })
  @ApiResponse({ status: 201, description: 'The computer has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateComputerDto,
    examples: {
      example1: {
        summary: 'Example Computer',
        value: {
          name: 'PC-01',
          pc_name: 'Dell Optiplex',
          position_x: 10.5,
          position_y: 20.5,
          labId: 1,
        },
      },
    },
  })
  create(@Body() createComputerDto: CreateComputerDto) {
    return this.computerService.create(createComputerDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Retrieve all computers' })
  @ApiResponse({ status: 200, description: 'Return all computers.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.computerService.findAll();
  }

  @Get('lab/:labId')
  @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Retrieve all computers in a specific lab' })
  @ApiResponse({ status: 200, description: 'Return all computers in the specified lab.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAllByLab(@Param('labId', ParseIntPipe) labId: number) {
    return this.computerService.findAllByLab(labId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Retrieve a single computer by ID' })
  @ApiResponse({ status: 200, description: 'Return the computer.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Computer not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.computerService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Update a computer' })
  @ApiResponse({ status: 200, description: 'The computer has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Computer not found.' })
  @ApiBody({
    type: UpdateComputerDto,
    examples: {
      updateName: {
        summary: 'Update Computer Name',
        value: { name: 'New PC Name' },
      },
      updatePosition: {
        summary: 'Update Computer Position',
        value: { position_x: 15.0, position_y: 25.0 },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateComputerDto: UpdateComputerDto) {
    return this.computerService.update(id, updateComputerDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Delete a computer' })
  @ApiResponse({ status: 200, description: 'The computer has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Computer not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.computerService.remove(id);
  }
}
