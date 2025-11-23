import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyCourseSelectService } from './my-course-select.service';
import { MyCourseSelectController } from './my-course-select.controller';
import { MyCourse } from './entities/my-course.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AvailableCourse } from './entities/available-course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MyCourse, AvailableCourse]), AuthModule],
  controllers: [MyCourseSelectController],
  providers: [MyCourseSelectService],
})
export class MyCourseSelectModule {}
