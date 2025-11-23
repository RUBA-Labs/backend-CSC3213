import { ApiProperty } from '@nestjs/swagger';

export class MyCourseResponseDto {
  @ApiProperty({ description: 'The unique identifier of the course entry', example: 1 })
  id: number;

  @ApiProperty({ description: 'The course code', example: 'CSC3213' })
  course_code: string;
}
