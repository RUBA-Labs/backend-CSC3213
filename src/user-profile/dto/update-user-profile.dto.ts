import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
    @ApiProperty({
        description: 'The full name of the user',
        example: 'John Doe',
        required: false,
    })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiProperty({
        description: 'The department of the user',
        example: 'Computer Science',
        required: false,
    })
    @IsOptional()
    @IsString()
    department?: string;

    @ApiProperty({
        description: 'The phone number of the user',
        example: '123-456-7890',
        required: false,
    })
    @IsOptional()
    @IsString()
    phone?: string;
}
