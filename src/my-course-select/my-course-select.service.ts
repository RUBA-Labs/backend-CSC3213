import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyCourse } from './entities/my-course.entity';
import { CreateMyCourseDto } from './dto/create-my-course.dto';
import { AvailableCourse } from './entities/available-course.entity';

@Injectable()
export class MyCourseSelectService {
  constructor(
    @InjectRepository(MyCourse)
    private readonly myCourseRepository: Repository<MyCourse>,
    @InjectRepository(AvailableCourse)
    private readonly availableCourseRepository: Repository<AvailableCourse>,
  ) {}

  async addCourses(courses: CreateMyCourseDto[], userId: number): Promise<MyCourse[]> {
    const coursesToSave = courses.map(courseDto => {
      const newCourse = this.myCourseRepository.create({
        ...courseDto,
        user_id: userId,
      });
      return newCourse;
    });

    return this.myCourseRepository.save(coursesToSave);
  }

  async findAllByUserId(userId: number): Promise<MyCourse[]> {
    return this.myCourseRepository.find({ where: { user_id: userId } });
  }

  async remove(id: number, userId: number): Promise<void> {
    const course = await this.myCourseRepository.findOne({ where: { id, user_id: userId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found for this user.`);
    }
    await this.myCourseRepository.remove(course);
  }

  async findAllAvailableCourses(): Promise<{ id: number; course_code: string }[]> {
    return this.availableCourseRepository.find({
        select: ['id', 'course_code'],
        order: {
            course_code: 'ASC'
        }
    });
  }
}
