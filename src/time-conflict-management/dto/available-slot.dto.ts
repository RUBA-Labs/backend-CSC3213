
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';

export class AvailableSlotDto {
  @ApiProperty({ description: 'The date of the available slot in YYYY-MM-DD format', example: '2025-12-25' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'The time of the available slot in HH:MM:SS format', example: '10:00:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  time: string;
}
