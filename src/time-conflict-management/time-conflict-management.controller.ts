
import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTimeConflictDto } from './dto/create-time-conflict.dto';
import { TimeConflictManagementService } from './time-conflict-management.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@ApiTags('Time Conflict Management')
@Controller('time-conflict-management')
export class TimeConflictManagementController {
  constructor(
    private readonly timeConflictManagementService: TimeConflictManagementService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a new time conflict request' })
  @ApiResponse({ status: 201, description: 'The time conflict request has been successfully created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createTimeConflict(
    @Req() req: AuthenticatedRequest,
    @Body() createTimeConflictDto: CreateTimeConflictDto,
  ) {
    const userId = req.user.userId; // Extract user ID from JWT payload
    return this.timeConflictManagementService.createTimeConflict(
      createTimeConflictDto,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard) // It's already applied at controller level, but explicitly adding here for clarity, though it's not strictly necessary.
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Retrieve all time conflict requests' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all time conflict requests.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAllTimeConflicts() {
    return this.timeConflictManagementService.findAllTimeConflicts();
  }
}
