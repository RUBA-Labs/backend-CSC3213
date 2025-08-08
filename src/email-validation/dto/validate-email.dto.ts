import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateEmailDto {
    @ApiProperty({
        description: 'The email address to validate and send OTP to',
        example: 'test@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
