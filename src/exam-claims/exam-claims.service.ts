import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamClaim } from './entities/exam-claim.entity';
import { CreateExamClaimDto } from './dto/create-exam-claim.dto';
import { User } from '../user/entities/user.entity';
import { ClaimItem } from './entities/claim-item.entity';
import { AddClaimItemDto } from './dto/add-claim-item.dto';

@Injectable()
export class ExamClaimsService {
  constructor(
    @InjectRepository(ExamClaim)
    private examClaimsRepository: Repository<ExamClaim>,
    @InjectRepository(ClaimItem)
    private claimItemRepository: Repository<ClaimItem>,
  ) {}

  create(createExamClaimDto: CreateExamClaimDto, user: User) {
    const newClaim = this.examClaimsRepository.create({
      ...createExamClaimDto,
      user,
    });
    return this.examClaimsRepository.save(newClaim);
  }

  async addClaimItem(addClaimItemDto: AddClaimItemDto) {
    const { claimId, ...rest } = addClaimItemDto;

    const examClaim = await this.examClaimsRepository.findOneBy({
      id: claimId,
    });
    if (!examClaim) {
      throw new NotFoundException(`ExamClaim with ID ${claimId} not found`);
    }

    const newClaimItem = this.claimItemRepository.create({
      ...rest,
      examClaim,
    });

    return this.claimItemRepository.save(newClaimItem);
  }
}
