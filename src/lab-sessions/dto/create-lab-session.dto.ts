import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateLabSessionDto {
    @ApiProperty({
        description: 'The name of the lab session.',
        example: 'Introduction to NestJS',
    })
    @IsString()
    sessionName: string;

    @ApiProperty({
        description: 'The date of the lab session (YYYY-MM-DD).',
        example: '2025-08-15',
        type: 'string',
        format: 'date',
    })
    @IsDateString()
    sessionDate: string;

    @ApiProperty({
        description: 'The time of the lab session (HH:MM:SS).',
        example: '10:00:00',
    })
    @IsString()
    sessionTime: string;

    @ApiProperty({
        description: 'A detailed description of the lab session.',
        example: 'This session covers the basics of NestJS framework.',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The name of the lecturer for the session.',
        example: 'Dr. John Doe',
    })
    @IsString()
    lecturer: string;

    @ApiProperty({
        description: 'The ID of the computer lab where the session will be held.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    })
    @IsUUID()
    labId: string;
}
