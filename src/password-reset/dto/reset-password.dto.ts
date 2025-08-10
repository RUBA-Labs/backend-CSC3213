import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: 'The email address for which OTP was sent', example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'The One-Time Password received via email', example: '123456' })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6) // Assuming OTP is 6 digits
    otp: string;

    @ApiProperty({ description: 'The secret key received in the send-otp response', example: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6' })
    @IsNotEmpty()
    @IsString()
    secret: string;

    @ApiProperty({ description: 'The new password for the user', example: 'newStrongPassword123' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    newPassword: string;
}
