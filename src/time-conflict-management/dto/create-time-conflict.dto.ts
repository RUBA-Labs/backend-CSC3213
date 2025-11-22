
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNotEmpty, IsString, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { AvailableSlotDto } from './available-slot.dto';

export class CreateTimeConflictDto {
  @ApiProperty({ description: 'The course code associated with the conflict', example: 'CSC101' })
  @IsString()
  @IsNotEmpty()
  course_code: string;

  @ApiProperty({ description: 'The original date of the conflict in YYYY-MM-DD format', example: '2025-12-24' })
  @IsDateString()
  @IsNotEmpty()
  original_date: string;

  @ApiProperty({ description: 'The original time of the conflict in HH:MM:SS format', example: '09:00:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  original_time: string;

  @ApiProperty({ type: [AvailableSlotDto], description: 'An array of available slots (date and time) to resolve the conflict' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailableSlotDto)
  available_slots: AvailableSlotDto[];

  @ApiProperty({ description: 'A description of the reason for the time conflict', example: 'Clash with another mandatory lecture.' })
  @IsString()
  @IsNotEmpty()
  reason_description: string;
}
