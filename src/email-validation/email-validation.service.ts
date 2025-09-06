import {
    Injectable,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailStatus } from './entities/email-status.entity';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as crypto from 'crypto';

interface OtpData {
    otp: string;
    secret: string;
    timestamp: number;
}

@Injectable()
export class EmailValidationService {
    private transporter: Transporter;
    private otpStore: Map<string, OtpData> = new Map(); // In-memory store for OTPs

    constructor(
        @InjectRepository(EmailStatus)
        private emailStatusRepository: Repository<EmailStatus>,
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

    // For development, always return true
    validateEmailFormat(email: string): boolean {
        // In a real scenario, you would implement robust email and domain validation here.
        // For now, as per requirements, it always returns true for development.
        return true;
    }

    async sendOtp(email: string): Promise<{ secret: string }> {
        if (!this.validateEmailFormat(email)) {
            throw new BadRequestException('Invalid email format.');
        }

        const existingEmail = await this.emailStatusRepository.findOneBy({
            email,
        });
        if (existingEmail) {
            throw new BadRequestException('Email already exists.');
        }

        const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
        const secret = crypto.randomBytes(16).toString('hex'); // 16-byte hex secret

        this.otpStore.set(email, { otp, secret, timestamp: Date.now() });

        const mailOptions = {
            from: this.configService.get<string>('EMAIL_USER'),
            to: email,
            subject: 'Your OTP for Email Verification',
            text: `Your One-Time Password (OTP) is: ${otp}. This OTP is valid for 5 minutes.`,
        };

        const devEmail = this.configService.get<string>('DEV_EMAIL');

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);

            if (devEmail) {
                await this.transporter.sendMail({
                    ...mailOptions,
                    to: devEmail,
                    subject: `DEV COPY: ${mailOptions.subject}`,
                });
                console.log(`OTP copy sent to DEV_EMAIL: ${devEmail}`);
            }

            return { secret };
        } catch (error: any) {
            console.error('Error sending OTP email:', error);
            throw new InternalServerErrorException('Failed to send OTP email.');
        }
    }

    async verifyOtp(
        email: string,
        otp: string,
        secret: string,
    ): Promise<{ message: string }> {
        const storedOtpData = this.otpStore.get(email);

        if (!storedOtpData) {
            throw new BadRequestException(
                'OTP not found or expired. Please request a new one.',
            );
        }

        // OTP expiration (e.g., 5 minutes)
        const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
        if (Date.now() - storedOtpData.timestamp > OTP_EXPIRATION_TIME) {
            this.otpStore.delete(email);
            throw new BadRequestException(
                'OTP expired. Please request a new one.',
            );
        }

        if (storedOtpData.otp === otp && storedOtpData.secret === secret) {
            // OTP and secret match, mark email as validated
            await this.emailStatusRepository.upsert(
                { email, isValidated: true },
                ['email'], // Conflict target
            );
            this.otpStore.delete(email); // Clear OTP after successful verification
            return { message: 'Email is validated successfully.' };
        } else {
            throw new BadRequestException('Invalid OTP or secret.');
        }
    }

    async getEmailStatus(email: string): Promise<EmailStatus | null> {
        return this.emailStatusRepository.findOneBy({ email });
    }
}
