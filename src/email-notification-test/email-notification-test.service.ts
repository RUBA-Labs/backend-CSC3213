import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLog } from './entities/email-log.entity';
import { SendEmailDto } from './dto/send-email.dto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailNotificationTestService {
  private transporter;

  constructor(
    @InjectRepository(EmailLog) private emailLogRepository: Repository<EmailLog>,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('APP_PASSWORD'),
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
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      status = 'sent';
    } catch (error) {
      console.error('Error sending email:', error);
      status = 'failed';
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