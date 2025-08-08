import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { EmailValidationService } from './email-validation.service';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Email Validation')
@Controller('email-validation')
export class EmailValidationController {
    constructor(private readonly emailValidationService: EmailValidationService) {}

    @Post('send-otp')
    @ApiOperation({ summary: 'Send OTP to email for validation' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully.', schema: { example: { message: 'OTP sent successfully.', secret: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6' } } })
    @ApiResponse({ status: 400, description: 'Invalid email format or other error.' })
    @ApiBody({ type: ValidateEmailDto, examples: { 'a': { value: { email: 'test@example.com' } } } })
    async sendOtp(@Body() validateEmailDto: ValidateEmailDto, @Res() res: Response) {
        const { email } = validateEmailDto;
        const { secret } = await this.emailValidationService.sendOtp(email);
        return res.status(HttpStatus.OK).json({ message: 'OTP sent successfully.', secret });
    }

    @Post('verify-otp')
    @ApiOperation({ summary: 'Verify OTP and secret to validate email' })
    @ApiResponse({ status: 200, description: 'Email is validated successfully.', schema: { example: { message: 'Email is validated successfully.' } } })
    @ApiResponse({ status: 400, description: 'Invalid OTP or secret, or OTP expired.' })
    @ApiBody({ type: VerifyOtpDto, examples: { 'a': { value: { email: 'test@example.com', otp: '123456', secret: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6' } } } })
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res() res: Response) {
        const { email, otp, secret } = verifyOtpDto;
        const result = await this.emailValidationService.verifyOtp(email, otp, secret);
        return res.status(HttpStatus.OK).json(result);
    }
}
