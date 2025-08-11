import { Controller, Post, Body, UseGuards, Req, Delete, Param, ParseIntPipe, Get, Query } from '@nestjs/common';
import { LabBookingService } from './lab-booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Lab Booking')
@ApiBearerAuth()
@Controller('lab-booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LabBookingController {
    constructor(private readonly labBookingService: LabBookingService) {}

    @Post()
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER, Role.FIRST_YEAR_STUDENT)
    @ApiOperation({ summary: 'Create a new booking' })
    @ApiResponse({ status: 201, description: 'The booking has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 409, description: 'Conflict.' })
    create(@Body() createBookingDto: CreateBookingDto, @Req() req: AuthenticatedRequest) {
        const userId = req.user.userId;
        return this.labBookingService.create(createBookingDto, userId);
    }

    @Delete(':bookingId')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER, Role.FIRST_YEAR_STUDENT)
    @ApiOperation({ summary: 'Delete a booking' })
    @ApiResponse({ status: 200, description: 'The booking has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Booking not found.' })
    remove(@Param('bookingId', ParseIntPipe) bookingId: number, @Req() req: AuthenticatedRequest) {
        const userId = req.user.userId;
        const roles = [req.user.role];
        return this.labBookingService.remove(bookingId, userId, roles);
    }

    @Get('available')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER, Role.FIRST_YEAR_STUDENT)
    @ApiOperation({ summary: 'Retrieve all available computers' })
    @ApiResponse({ status: 200, description: 'Return all available computers.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    findAllAvailableComputers(@Query('date') date: string, @Query('time') time: string) {
        return this.labBookingService.findAllAvailableComputers(date, time);
    }

    @Get('booked')
    @Roles(Role.ADMIN, Role.LAB_ALLOCATION_ADMIN, Role.DEVELOPER, Role.FIRST_YEAR_STUDENT)
    @ApiOperation({ summary: 'Retrieve all booked computers' })
    @ApiResponse({ status: 200, description: 'Return all booked computers.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    findAllBookedComputers(@Query('date') date: string, @Query('time') time: string) {
        return this.labBookingService.findAllBookedComputers(date, time);
    }
}