import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'User\'s email address', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User\'s password', example: 'password' })
  @IsString()
  @MinLength(6)
  password: string;
}
