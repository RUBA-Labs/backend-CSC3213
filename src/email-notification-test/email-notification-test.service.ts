/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
import { SendEmailDto } from './dto/send-email.dto';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailNotificationTestService {
    private transporter: Transporter;

    constructor(
        @InjectRepository(EmailLog)
        private emailLogRepository: Repository<EmailLog>,
        private configService: ConfigService,
    ) {
        const emailUser = this.configService.get<string>('EMAIL_USER');
        const appPassword = this.configService.get<string>('APP_PASSWORD');

        if (!emailUser || !appPassword) {
            throw new InternalServerErrorException(
                'Email credentials (EMAIL_USER, APP_PASSWORD) are not configured.',
            );
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: appPassword,
            },
        });
    }

    async sendEmail(sendEmailDto: SendEmailDto): Promise<EmailLog> {
        const { to, subject, body } = sendEmailDto;

        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to,
            subject,
            text: body,
        };

        let status = 'failed';
        try {
            const info: nodemailer.SentMessageInfo =
                await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            status = 'sent';
        } catch (error: any) {
            console.error('Error sending email:', error);
            status = 'failed';
            throw new InternalServerErrorException(
                'Failed to send email',
                error.message /* eslint-disable-line @typescript-eslint/no-unsafe-argument */,
            );
        }

        const emailLog = this.emailLogRepository.create({
            to,
            subject,
            body,
            status,
        });

        return this.emailLogRepository.save(emailLog);
    }
}
