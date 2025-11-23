import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyCourse } from './entities/my-course.entity';
import { CreateMyCourseDto } from './dto/create-my-course.dto';

@Injectable()
export class MyCourseSelectService {
  constructor(
    @InjectRepository(MyCourse)
    private readonly myCourseRepository: Repository<MyCourse>,
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
}
