import {
    Controller,
    Get,
    Param,
    UseGuards,
    Post,
    Body,
    Request,
} from '@nestjs/common';
import { LabBookingService } from './lab-booking.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBody,
    ApiResponse,
} from '@nestjs/swagger';
import { CreateLabBookingDto } from './dto/create-lab-booking.dto';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@ApiTags('Lab Booking')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lab-booking')
export class LabBookingController {
    constructor(private readonly labBookingService: LabBookingService) {}

    @Get('status/:labSessionId')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get booking status of computers for a lab session',
    })
    @Roles(
        Role.FIRST_YEAR_STUDENT,
        Role.ADMIN,
        Role.LAB_ALLOCATION_ADMIN,
        Role.DEVELOPER,
    )
    async getLabSessionBookingStatus(
        @Param('labSessionId') labSessionId: string,
    ) {
        return this.labBookingService.getLabSessionBookingStatus(labSessionId);
    }

    @Post('book')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Book a computer for a lab session' })
    @ApiBody({ type: CreateLabBookingDto })
    @ApiResponse({ status: 201, description: 'Computer successfully booked.' })
    @ApiResponse({
        status: 404,
        description: 'Lab session or computer not found.',
    })
    @ApiResponse({
        status: 409,
        description: 'Computer already booked for this session.',
    })
    @Roles(
        Role.FIRST_YEAR_STUDENT,
        Role.ADMIN,
        Role.LAB_ALLOCATION_ADMIN,
        Role.DEVELOPER,
    )
    async bookComputer(
        @Body() createLabBookingDto: CreateLabBookingDto,
        @Request() req: AuthenticatedRequest,
    ) {
        const userId = String(req.user.userId); // Cast userId to string
        const { labSessionId, computerId } = createLabBookingDto;
        return this.labBookingService.bookComputer(
            labSessionId,
            computerId,
            userId,
        );
    }
}
