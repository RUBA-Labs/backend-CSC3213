import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComputerLabsService } from './computer-labs.service';
import { CreateComputerLabDto } from './dto/create-computer-lab.dto';
import { UpdateComputerLabDto } from './dto/update-computer-lab.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@ApiTags('Computer Labs')
@Controller('computer-labs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComputerLabsController {
  constructor(private readonly computerLabsService: ComputerLabsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new computer lab' })
  @ApiResponse({ status: 201, description: 'The computer lab has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createComputerLabDto: CreateComputerLabDto) {
    return this.computerLabsService.create(createComputerLabDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all computer labs' })
  @ApiResponse({ status: 200, description: 'Return all computer labs.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.computerLabsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a single computer lab by ID' })
  @ApiResponse({ status: 200, description: 'Return the computer lab.' })
  @ApiResponse({ status: 404, description: 'Computer lab not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.computerLabsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a computer lab' })
  @ApiResponse({ status: 200, description: 'The computer lab has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Computer lab not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateComputerLabDto: UpdateComputerLabDto) {
    return this.computerLabsService.update(id, updateComputerLabDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a computer lab' })
  @ApiResponse({ status: 200, description: 'The computer lab has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Computer lab not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.computerLabsService.remove(id);
  }
}