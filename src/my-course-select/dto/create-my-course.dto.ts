import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMyCourseDto {
  @ApiProperty({ description: 'The course code', example: 'CSC3213' })
  @IsString()
  @IsNotEmpty()
  course_code: string;

  @ApiProperty({ description: 'The name of the course (optional)', example: 'Project in Computer Science I', required: false })
  @IsString()
  course_name?: string;
}
