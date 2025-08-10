import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateLabDto {
    @ApiProperty({ description: 'The name of the lab', example: 'Computer Lab 1' })
    @IsString()
    @IsNotEmpty()
    labName: string;

    @ApiProperty({ description: 'The date of the lab allocation (YYYY-MM-DD)', example: '2025-08-15' })
    @IsString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ description: 'The time slot of the lab allocation (e.g., HH:MM-HH:MM)', example: '10:00-12:00' })
    @IsString()
    @IsNotEmpty()
    time: string;

    @ApiProperty({ description: 'The number of computers available in the lab', example: 30 })
    @IsNumber()
    @Min(1)
    numberOfComputers: number;

    @ApiProperty({ description: 'The name of the lecturer assigned to the lab', example: 'Dr. Smith' })
    @IsString()
    @IsNotEmpty()
    lecturerName: string;
}
