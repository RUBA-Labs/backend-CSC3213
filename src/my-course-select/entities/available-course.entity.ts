import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('available_courses')
@Unique(['course_code'])
export class AvailableCourse {
  @ApiProperty({ description: 'The unique identifier for the available course', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The unique course code', example: 'CS101' })
  @Column()
  course_code: string;

  @ApiProperty({ description: 'The full name of the course (can be null)', example: 'Introduction to Computer Science', nullable: true })
  @Column({ nullable: true })
  course_name: string;
}
