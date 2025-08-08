import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { DatabaseTestService } from './database-test.service';
import { CreateDatabaseTestDto } from './dto/create-database-test.dto';
import { UpdateDatabaseTestDto } from './dto/update-database-test.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@ApiTags('Database Test')
@ApiBearerAuth()
@Controller('database-test')
@UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
@Roles(Role.DEVELOPER)
export class DatabaseTestController {
    constructor(private readonly databaseTestService: DatabaseTestService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new database test entry' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
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
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.databaseTestService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a database test entry' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @ApiResponse({ status: 404, description: 'Record not found.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDatabaseTestDto: UpdateDatabaseTestDto,
    ) {
        return this.databaseTestService.update(id, updateDatabaseTestDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a database test entry' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully deleted.',
    })
    @ApiResponse({ status: 404, description: 'Record not found.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.databaseTestService.remove(id);
    }
}
