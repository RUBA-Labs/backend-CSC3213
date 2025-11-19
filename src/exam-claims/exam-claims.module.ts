import { Module } from '@nestjs/common';
import { ExamClaimsService } from './exam-claims.service';
import { ExamClaimsController } from './exam-claims.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ExamClaim } from './entities/exam-claim.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ExamClaim])],
  controllers: [ExamClaimsController],
  providers: [ExamClaimsService],
})
export class ExamClaimsModule {}
