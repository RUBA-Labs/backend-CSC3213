import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Public } from '../auth/public.decorator';
import { Role } from './role.enum';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard, ThrottlerGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @Public()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
        status: 201,
        description: 'The user has been successfully created.',
    })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.DEVELOPER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve all users' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.DEVELOPER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve a single user by ID' })
    @ApiResponse({ status: 200, description: 'Return the user.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.DEVELOPER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully updated.',
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiBody({
        type: UpdateUserDto,
        examples: {
            updateEmailAndFullName: {
                summary: 'Update email and full name example',
                value: {
                    email: 'new.email@example.com',
                    fullName: 'New Full Name',
                },
            },
            updateDepartment: {
                summary: 'Update department example',
                value: {
                    department: 'New Department Name',
                },
            },
            updatePhone: {
                summary: 'Update phone number example',
                value: {
                    phone: '987-654-3210',
                },
            },
            updateAllFields: {
                summary: 'Update all fields example',
                value: {
                    email: 'all.fields@example.com',
                    password: 'newSecurePassword',
                    role: 'academic',
                    fullName: 'Updated All Fields User',
                    department: 'Updated Department',
                    phone: '111-222-3333',
                },
            },
        },
    })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.DEVELOPER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({
        status: 200,
        description: 'The user has been successfully deleted.',
    })
    @ApiResponse({ status: 404, description: 'User not found.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}
