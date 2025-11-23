import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMyCourseDto {
  @ApiProperty({ description: 'The course code', example: 'CSC3213' })
  @IsString()
  @IsNotEmpty()
  course_code: string;

  @ApiProperty({ description: 'The name of the course', example: 'Project in Computer Science I' })
  @IsString()
  @IsNotEmpty()
  course_name: string;
}
