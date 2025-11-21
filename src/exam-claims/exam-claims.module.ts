import { Module } from '@nestjs/common';
import { ExamClaimsService } from './exam-claims.service';
import { ExamClaimsController } from './exam-claims.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ExamClaim } from './entities/exam-claim.entity';
import { ClaimItem } from './entities/claim-item.entity';
import { ClaimItemStatus } from './entities/claim-item-status.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ExamClaim, ClaimItem, ClaimItemStatus])],
  controllers: [ExamClaimsController],
  providers: [ExamClaimsService],
})
export class ExamClaimsModule {}
