import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ComputersService } from './computers.service';
import { CreateComputerDto } from './dto/create-computer.dto';
import { UpdateComputerDto } from './dto/update-computer.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@ApiTags('Computers')
@Controller('computers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComputersController {
    constructor(private readonly computersService: ComputersService) {}

    @Post()
    @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new computer' })
    @ApiResponse({
        status: 201,
        description: 'The computer has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(@Body() createComputerDto: CreateComputerDto) {
        return this.computersService.create(createComputerDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve all computers' })
    @ApiResponse({ status: 200, description: 'Return all computers.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    findAll() {
        return this.computersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve a single computer by ID' })
    @ApiResponse({ status: 200, description: 'Return the computer.' })
    @ApiResponse({ status: 404, description: 'Computer not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    findOne(@Param('id') id: string) {
        return this.computersService.findOne(id);
    }

    @Get('lab/:id')
    @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve all computers by lab ID' })
    @ApiResponse({ status: 200, description: 'Return the computers.' })
    @ApiResponse({ status: 404, description: 'Computers not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    findByLabId(@Param('id') id: string) {
        return this.computersService.findByLabId(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a computer' })
    @ApiResponse({
        status: 200,
        description: 'The computer has been successfully updated.',
    })
    @ApiResponse({ status: 404, description: 'Computer not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    update(
        @Param('id') id: string,
        @Body() updateComputerDto: UpdateComputerDto,
    ) {
        return this.computersService.update(id, updateComputerDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.DEVELOPER, Role.LAB_ALLOCATION_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a computer' })
    @ApiResponse({
        status: 200,
        description: 'The computer has been successfully deleted.',
    })
    @ApiResponse({ status: 404, description: 'Computer not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    remove(@Param('id') id: string) {
        return this.computersService.remove(id);
    }
}
