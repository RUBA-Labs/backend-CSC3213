import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestPasswordResetDto {
    @ApiProperty({ description: 'The email address for password reset', example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
