import { Controller, Post, Body, UseGuards, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { LabAllocationService } from './lab-allocation.service';
import { CreateLabDto } from './dto/create-lab.dto';
import { UpdateLabDto } from './dto/update-lab.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('Lab Allocation')
@ApiBearerAuth()
@Controller('lab-allocation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabAllocationController {
    constructor(private readonly labAllocationService: LabAllocationService) {}

    @Post('labs')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
    @ApiOperation({ summary: 'Create a new lab allocation' })
    @ApiResponse({ status: 201, description: 'The lab allocation has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: CreateLabDto,
        examples: {
            example1: {
                summary: 'Example Lab Allocation',
                value: {
                    labName: 'Computer Lab 1',
                    date: '2025-08-15',
                    time: '10:00-12:00',
                    numberOfComputers: 30,
                    lecturerName: 'Dr. Smith',
                },
            },
        },
    })
    async createLab(@Body() createLabDto: CreateLabDto) {
        return this.labAllocationService.createLab(createLabDto);
    }

    @Get('labs')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
    @ApiOperation({ summary: 'Retrieve all lab allocations' })
    @ApiResponse({ status: 200, description: 'Return all lab allocations.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async findAllLabs() {
        return this.labAllocationService.findAllLabs();
    }

    @Get('labs/:id')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
    @ApiOperation({ summary: 'Retrieve a single lab allocation by ID' })
    @ApiResponse({ status: 200, description: 'Return the lab allocation.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Lab allocation not found.' })
    async findLabById(@Param('id', ParseIntPipe) id: number) {
        return this.labAllocationService.findLabById(id);
    }

    @Patch('labs/:id')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
    @ApiOperation({ summary: 'Update a lab allocation' })
    @ApiResponse({ status: 200, description: 'The lab allocation has been successfully updated.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Lab allocation not found.' })
    @ApiBody({
        type: UpdateLabDto,
        examples: {
            updateName: {
                summary: 'Update Lab Name',
                value: { labName: 'New Computer Lab Name' },
            },
            updateTime: {
                summary: 'Update Lab Time',
                value: { time: '14:00-16:00' },
            },
        },
    })
    async updateLab(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateLabDto: UpdateLabDto,
    ) {
        return this.labAllocationService.updateLab(id, updateLabDto);
    }

    @Delete('labs/:id')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER)
    @ApiOperation({ summary: 'Delete a lab allocation' })
    @ApiResponse({ status: 200, description: 'The lab allocation has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Lab allocation not found.' })
    async deleteLab(@Param('id', ParseIntPipe) id: number) {
        return this.labAllocationService.deleteLab(id);
    }
}

