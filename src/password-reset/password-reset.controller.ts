import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('Password Reset')
@Controller('password-reset')
export class PasswordResetController {
    constructor(private readonly passwordResetService: PasswordResetService) {}

    @Post('request')
    @ApiOperation({ summary: 'Request a password reset OTP' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully.', schema: { example: { secret: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6' } } })
    @ApiResponse({ status: 400, description: 'Email not found or not validated.' })
    @ApiResponse({ status: 404, description: 'User with this email does not exist.' })
    @ApiBody({ type: RequestPasswordResetDto, examples: { a: { value: { email: 'user@example.com' } } } })
    async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
        return this.passwordResetService.requestPasswordReset(requestPasswordResetDto);
    }

    @Post('reset')
    @ApiOperation({ summary: 'Reset password with OTP and new password' })
    @ApiResponse({ status: 200, description: 'Password reset successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid OTP or secret, or OTP expired.' })
    @ApiResponse({ status: 404, description: 'User with this email does not exist.' })
    @ApiBody({ type: ResetPasswordDto, examples: { a: { value: { email: 'user@example.com', otp: '123456', secret: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6', newPassword: 'newStrongPassword123' } } } })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.passwordResetService.resetPassword(resetPasswordDto);
    }
}

