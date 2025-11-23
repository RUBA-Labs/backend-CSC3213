
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
}

export class CreateScheduleDto {
  @ApiProperty({ description: 'The ID of the room', example: 1 })
  @IsInt()
  @IsNotEmpty()
  room_id: number;

  @ApiProperty({ description: 'The course code', example: 'CS101' })
  @IsString()
  @IsNotEmpty()
  course_code: string;

  @ApiProperty({
    description: 'The day of the week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  day_of_week: DayOfWeek;

  @ApiProperty({ description: 'The start time in HH:MM:SS format', example: '09:00:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  start_time: string;

  @ApiProperty({ description: 'The end time in HH:MM:SS format', example: '11:00:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
  end_time: string;
}
