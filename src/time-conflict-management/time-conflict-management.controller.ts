
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
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
}
