import { Controller, Post, Body, UseGuards, Req, ParseArrayPipe } from '@nestjs/common';
import { MyCourseSelectService } from './my-course-select.service';
import { CreateMyCourseDto } from './dto/create-my-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MyCourse } from './entities/my-course.entity';

@ApiTags('MyCourseSelect')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('my-course-select')
export class MyCourseSelectController {
  constructor(private readonly myCourseSelectService: MyCourseSelectService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Add a list of selected courses for the current user',
    description: 'Takes a JSON object with a `courses` property containing an array of course objects. Each course is then associated with the authenticated user.'
  })
  @ApiBody({
    description: 'A JSON object containing a `courses` array of course data to be created.',
    schema: {
      type: 'object',
      required: ['courses'],
      properties: {
        courses: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              course_code: { type: 'string', example: 'CSC3213' },
              course_name: { type: 'string', example: 'Project in Computer Science I' },
            },
            required: ['course_code', 'course_name'],
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The courses have been successfully created and are returned in the response.', type: [MyCourse] })
  @ApiResponse({ status: 400, description: 'Bad Request. The request body is malformed, invalid, or missing required fields.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. JWT token is missing or invalid.' })
  addCourses(
    @Body('courses', new ParseArrayPipe({ items: CreateMyCourseDto })) createMyCourseDto: CreateMyCourseDto[],
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.myCourseSelectService.addCourses(createMyCourseDto, userId);
  }
}
