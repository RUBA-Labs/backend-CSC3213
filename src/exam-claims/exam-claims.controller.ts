import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExamClaimsService } from './exam-claims.service';
import { CreateExamClaimDto } from './dto/create-exam-claim.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { User } from '../user/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Exam Claims')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exam-claims')
export class ExamClaimsController {
  constructor(private readonly examClaimsService: ExamClaimsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new exam claim' })
  @ApiBody({ type: CreateExamClaimDto })
  @ApiResponse({
    status: 201,
    description: 'The exam claim has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles(Role.DEVELOPER, Role.ADMIN, Role.EXAM_CLAIMS_ADMIN, Role.ACADEMIC)
  create(
    @Body() createExamClaimDto: CreateExamClaimDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const user = { id: req.user.userId } as User;
    return this.examClaimsService.create(createExamClaimDto, user);
  }
}
