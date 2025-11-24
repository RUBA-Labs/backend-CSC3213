import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('my_courses')
export class MyCourse {
  @ApiProperty({ description: 'The unique identifier of the course entry', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The course code', example: 'CSC3213' })
  @Column()
  course_code: string;

  @ApiProperty({ description: 'The name of the course (can be null)', example: 'Project in Computer Science I', nullable: true })
  @Column({ nullable: true })
  course_name: string;

  @ApiProperty({ description: 'The ID of the user who selected the course', example: 1 })
  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.myCourses)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
