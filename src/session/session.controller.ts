import {
    Controller,
    Get,
    Delete,
    Param,
    UseGuards,
    Req,
    ParseUUIDPipe,
    ParseIntPipe,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

interface AuthenticatedRequest extends Request {
    user: { userId: number; role: string };
}

@ApiTags('Session')
@ApiBearerAuth()
@Controller('session')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Get()
    @ApiOperation({ summary: 'Get all active sessions for the current user' })
    @ApiResponse({ status: 200, description: 'A list of active sessions.' })
    async getSessions(@Req() req: AuthenticatedRequest) {
        const userId = req.user.userId;
        return this.sessionService.findSessionsByUser(userId);
    }

    @Get('all')
    @Roles(Role.DEVELOPER)
    @ApiOperation({
        summary: 'Get all active sessions for all users (Developer only)',
    })
    @ApiResponse({ status: 200, description: 'A list of all active sessions.' })
    async getAllSessions() {
        return this.sessionService.findAllSessions();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Logout from a specific device (revoke session)' })
    @ApiResponse({ status: 200, description: 'Session successfully revoked.' })
    @ApiResponse({ status: 404, description: 'Session not found.' })
    async logout(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const user = req.user;
        return this.sessionService.revokeSession(id, user);
    }

    @Delete('user/:userId')
    @Roles(Role.DEVELOPER)
    @ApiOperation({
        summary: 'Logout from all devices for a specific user (Developer only)',
    })
    @ApiResponse({
        status: 200,
        description: 'All sessions for the user successfully revoked.',
    })
    async logoutAllUserSessions(@Param('userId', ParseIntPipe) userId: number) {
        return this.sessionService.revokeAllSessionsForUser(userId);
    }

    @Delete()
    @ApiOperation({
        summary:
            'Logout from all devices (revoke all sessions for the current user)',
    })
    @ApiResponse({
        status: 200,
        description: 'All sessions successfully revoked.',
    })
    async logoutAll(@Req() req: AuthenticatedRequest) {
        const userId = req.user.userId;
        return this.sessionService.revokeAllSessionsForUser(userId);
    }
}
