import { Controller, Post, Body } from '@nestjs/common';
import { EmailNotificationTestService } from './email-notification-test.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Email Notification Test')
@Controller('email-notification-test')
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
