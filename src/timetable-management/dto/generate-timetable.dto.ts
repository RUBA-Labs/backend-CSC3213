import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTimetableDto {
  @ApiProperty({
    description: 'The user-provided prompt for generating the timetable.',
    example: 'Generate a timetable for the first year students.',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
