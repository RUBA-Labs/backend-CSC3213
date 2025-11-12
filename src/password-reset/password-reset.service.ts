import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { EmailValidationService } from '../email-validation/email-validation.service';
import { UserService } from '../user/user.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class PasswordResetService {
    constructor(
        private readonly emailValidationService: EmailValidationService,
        private readonly userService: UserService,
    ) {}

    async requestPasswordReset(
        requestPasswordResetDto: RequestPasswordResetDto,
    ): Promise<{ secret: string }> {
        const { email } = requestPasswordResetDto;

        // 1. Check if email exists and is validated in email_status table
        const emailStatus =
            await this.emailValidationService.getEmailStatus(email);
        if (!emailStatus || !emailStatus.isValidated) {
            throw new BadRequestException('Email not found or not validated.');
        }

        // 2. Check if user exists with this email
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User with this email does not exist.');
        }

        // 3. Send OTP to user
        const { secret } =
            await this.emailValidationService.sendPasswordResetOtp(email);
        return { secret };
    }

    async resetPassword(
        resetPasswordDto: ResetPasswordDto,
    ): Promise<{ message: string }> {
        const { email, otp, secret, newPassword } = resetPasswordDto;

        // 1. Verify OTP
        const otpVerificationResult =
            await this.emailValidationService.verifyOtp(email, otp, secret);
        if (
            otpVerificationResult.message !== 'Email is validated successfully.'
        ) {
            throw new BadRequestException(otpVerificationResult.message);
        }

        // 2. Find the user by email
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User with this email does not exist.');
        }

        // 3. Update user's password
        // UserService.update handles hashing the password
        await this.userService.update(user.id, { password: newPassword });

        return { message: 'Password reset successfully.' };
    }
}
