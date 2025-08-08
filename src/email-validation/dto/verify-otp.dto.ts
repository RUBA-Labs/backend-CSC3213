import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({
        description: 'The email address for which OTP was sent',
        example: 'test@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The One-Time Password received via email',
        example: '123456',
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6) // Assuming OTP is 6 digits
    otp: string;

    @ApiProperty({
        description: 'The secret key received in the send-otp response',
        example: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    })
    @IsNotEmpty()
    @IsString()
    secret: string;
}
