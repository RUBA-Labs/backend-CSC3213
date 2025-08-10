import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ description: 'The user\'s current password', example: 'oldPassword123' })
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty({ description: 'The user\'s new password', example: 'newStrongPassword456' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    newPassword: string;
}
