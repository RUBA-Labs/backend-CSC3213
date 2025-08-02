import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Role } from '../role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The email of the user', example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The role of the user', enum: Role, example: Role.STUDENT })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: 'The full name of the user', example: 'John Doe', required: false })
  @IsOptional()
  fullName?: string;

  @ApiProperty({ description: 'The department of the user', example: 'Computer Science', required: false })
  @IsOptional()
  department?: string;

  @ApiProperty({ description: 'The phone number of the user', example: '123-456-7890', required: false })
  @IsOptional()
  phone?: string;
}
