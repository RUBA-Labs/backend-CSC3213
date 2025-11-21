import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
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
  ApiParam,
} from '@nestjs/swagger';
import { AddClaimItemDto } from './dto/add-claim-item.dto';
import { ClaimItem } from './entities/claim-item.entity';

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

  @Post('add-item')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new item to an exam claim' })
  @ApiBody({ type: AddClaimItemDto })
  @ApiResponse({
    status: 201,
    description: 'The claim item has been successfully added.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Exam claim not found.' })
  @Roles(Role.DEVELOPER, Role.ADMIN, Role.EXAM_CLAIMS_ADMIN, Role.ACADEMIC)
  addClaimItem(@Body() addClaimItemDto: AddClaimItemDto): Promise<ClaimItem> {
    return this.examClaimsService.addClaimItem(addClaimItemDto);
  }

  @Get(':id/statuses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all statuses of claim items for a specific exam claim' })
  @ApiParam({ name: 'id', description: 'ID of the Exam Claim', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved claim item statuses.',
    type: [ClaimItem], // Assuming ClaimItem includes its status now due to relations
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Exam claim not found.' })
  @Roles(Role.DEVELOPER, Role.ADMIN, Role.EXAM_CLAIMS_ADMIN, Role.ACADEMIC)
  getClaimItemStatuses(@Param('id') id: number): Promise<ClaimItem[]> {
    return this.examClaimsService.getClaimItemStatuses(id);
  }
}
