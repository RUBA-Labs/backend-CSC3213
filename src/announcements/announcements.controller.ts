import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { User } from '../user/entities/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new announcement',
    description: 'Creates a new announcement and sends notifications to the selected audience (a specific role or all users).',
  })
  @ApiBody({ type: CreateAnnouncementDto })
  @ApiResponse({
    status: 201,
    description: 'The announcement has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(Role.ADMIN, Role.ACADEMIC, Role.DEVELOPER)
  create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const user = { id: req.user.userId } as User;
    return this.announcementsService.create(createAnnouncementDto, user);
  }

  @Get('my-announcements')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all announcements created by the current user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all announcements for the current user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllByCreator(@Request() req: AuthenticatedRequest) {
    return this.announcementsService.findAllByCreator(req.user.userId);
  }
}