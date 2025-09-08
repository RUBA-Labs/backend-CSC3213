import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Req,
    Param,
    HttpCode,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBody,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { NotificationDto } from './dto/notification.dto';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new notification' })
    @ApiBody({
        type: CreateNotificationDto,
        description: 'The data to create a notification',
        examples: {
            example1: {
                value: {
                    userId: 1,
                    message: 'New message',
                    description: 'This is a new message',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'The notification has been successfully created.',
        schema: {
            type: 'object',
            properties: { id: { type: 'string' }, message: { type: 'string' } },
            example: {
                id: 'd9b9185c-efab-407e-8c96-473c66247f51',
                message: 'Notification created successfully',
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async create(
        @Body() createNotificationDto: CreateNotificationDto,
    ): Promise<{ id: string; message: string }> {
        return this.notificationService.createNotification(
            createNotificationDto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all notifications for the current user' })
    @ApiResponse({
        status: 200,
        description: 'A list of notifications',
        type: [NotificationDto],
    })
    async findAll(
        @Req() req: AuthenticatedRequest,
    ): Promise<NotificationDto[]> {
        return this.notificationService.findAllByUser(req.user.userId);
    }

    @Post('/:id/read')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark a notification as read' })
    @ApiResponse({ status: 204, description: 'Notification marked as read' })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    @HttpCode(204)
    async markAsRead(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest,
    ): Promise<void> {
        return this.notificationService.markAsRead(id, req.user.userId);
    }

    @Post('/:id/unread')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mark a notification as unread' })
    @ApiResponse({ status: 204, description: 'Notification marked as unread' })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    @HttpCode(204)
    async markAsUnread(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest,
    ): Promise<void> {
        return this.notificationService.markAsUnread(id, req.user.userId);
    }
}
