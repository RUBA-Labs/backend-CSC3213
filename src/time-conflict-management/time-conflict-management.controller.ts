
import { Controller, Post, Body, Req, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTimeConflictDto } from './dto/create-time-conflict.dto';
import { UpdateViewStatusDto } from './dto/update-view-status.dto';
import { TimeConflictManagementService } from './time-conflict-management.service';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/role.enum';

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

  @Post(':id/view-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TIME_TABLE_ADMIN, Role.DEVELOPER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the viewed status of a time conflict request' })
  @ApiResponse({ status: 200, description: 'Time conflict request viewed status updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User does not have sufficient roles.' })
  @ApiResponse({ status: 404, description: 'Time Conflict Request not found.' })
  async updateTimeConflictViewStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateViewStatusDto: UpdateViewStatusDto,
  ) {
    return this.timeConflictManagementService.updateViewStatus(id, updateViewStatusDto.is_viewed);
  }
}
