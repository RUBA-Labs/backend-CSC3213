import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamClaim } from './entities/exam-claim.entity';
import { CreateExamClaimDto } from './dto/create-exam-claim.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ExamClaimsService {
  constructor(
    @InjectRepository(ExamClaim)
    private examClaimsRepository: Repository<ExamClaim>,
  ) {}

  create(createExamClaimDto: CreateExamClaimDto, user: User) {
    const newClaim = this.examClaimsRepository.create({
      ...createExamClaimDto,
      user,
    });
    return this.examClaimsRepository.save(newClaim);
  }
}
