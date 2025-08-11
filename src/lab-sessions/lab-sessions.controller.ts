import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LabSessionsService } from './lab-sessions.service';
import { CreateLabSessionDto } from './dto/create-lab-session.dto';
import { UpdateLabSessionDto } from './dto/update-lab-session.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@ApiTags('Lab Sessions')
@Controller('lab-sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabSessionsController {
  constructor(private readonly labSessionsService: LabSessionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN, Role.ACADEMIC)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new lab session' })
  @ApiResponse({ status: 201, description: 'The lab session has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createLabSessionDto: CreateLabSessionDto) {
    return this.labSessionsService.create(createLabSessionDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN, Role.ACADEMIC)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve all lab sessions' })
  @ApiResponse({ status: 200, description: 'Return all lab sessions.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.labSessionsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN, Role.ACADEMIC)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a single lab session by ID' })
  @ApiResponse({ status: 200, description: 'Return the lab session.' })
  @ApiResponse({ status: 404, description: 'Lab session not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findOne(@Param('id') id: string) {
    return this.labSessionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN, Role.ACADEMIC)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a lab session' })
  @ApiResponse({ status: 200, description: 'The lab session has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Lab session not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() updateLabSessionDto: UpdateLabSessionDto) {
    return this.labSessionsService.update(id, updateLabSessionDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN, Role.ACADEMIC)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a lab session' })
  @ApiResponse({ status: 200, description: 'The lab session has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Lab session not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.labSessionsService.remove(id);
  }
}