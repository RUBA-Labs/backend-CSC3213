import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailNotificationTestService } from './email-notification-test.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@ApiTags('Email Notification Test')
@ApiBearerAuth()
@Controller('email-notification-test')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DEVELOPER)
export class EmailNotificationTestController {
    constructor(
        private readonly emailNotificationTestService: EmailNotificationTestService,
    ) {}

    @Post('send')
    @ApiOperation({ summary: 'Send an email and log the details' })
    @ApiBody({
        type: SendEmailDto,
        examples: {
            a: {
                summary: 'Example Email',
                value: {
                    to: 'recipient@example.com',
                    subject: 'Test Subject',
                    body: 'This is the body of the test email.',
                } as SendEmailDto,
            },
        },
    })
    async sendEmail(@Body() sendEmailDto: SendEmailDto) {
        return this.emailNotificationTestService.sendEmail(sendEmailDto);
    }
}
