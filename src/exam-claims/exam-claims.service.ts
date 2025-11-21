import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExamClaim } from './entities/exam-claim.entity';
import { CreateExamClaimDto } from './dto/create-exam-claim.dto';
import { User } from '../user/entities/user.entity';
import { ClaimItem } from './entities/claim-item.entity';
import { AddClaimItemDto } from './dto/add-claim-item.dto';
import { ClaimItemStatus } from './entities/claim-item-status.entity';
import { ClaimItemStatusValue } from './entities/claim-item-status.enum';

@Injectable()
export class ExamClaimsService {
  constructor(
    @InjectRepository(ExamClaim)
    private examClaimsRepository: Repository<ExamClaim>,
    @InjectRepository(ClaimItem)
    private claimItemRepository: Repository<ClaimItem>,
    @InjectRepository(ClaimItemStatus)
    private claimItemStatusRepository: Repository<ClaimItemStatus>,
    private dataSource: DataSource,
  ) {}

  create(createExamClaimDto: CreateExamClaimDto, user: User) {
    const newClaim = this.examClaimsRepository.create({
      ...createExamClaimDto,
      user,
    });
    return this.examClaimsRepository.save(newClaim);
  }

  async addClaimItem(addClaimItemDto: AddClaimItemDto): Promise<ClaimItem> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { claimId, ...rest } = addClaimItemDto;

      const examClaim = await queryRunner.manager.findOne(ExamClaim, {
        where: { id: claimId },
      });
      if (!examClaim) {
        throw new NotFoundException(`ExamClaim with ID ${claimId} not found`);
      }

      const newClaimItem = queryRunner.manager.create(ClaimItem, {
        ...rest,
        examClaim,
      });
      await queryRunner.manager.save(ClaimItem, newClaimItem);

      const newClaimItemStatus = queryRunner.manager.create(ClaimItemStatus, {
        status: ClaimItemStatusValue.PENDING,
        claimItem: newClaimItem,
      });
      await queryRunner.manager.save(ClaimItemStatus, newClaimItemStatus);

      // Link the status back to the claim item for consistency,
      // though the cascade should handle it on save of newClaimItem
      newClaimItem.status = newClaimItemStatus;
      await queryRunner.manager.save(ClaimItem, newClaimItem);


      await queryRunner.commitTransaction();
      return newClaimItem;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getClaimItemStatuses(examClaimId: number): Promise<ClaimItem[]> {
    const examClaim = await this.examClaimsRepository.findOne({
      where: { id: examClaimId },
      relations: ['claimItems', 'claimItems.status'], // Eager load claimItems and their statuses
    });

    if (!examClaim) {
      throw new NotFoundException(`ExamClaim with ID ${examClaimId} not found`);
    }

    return examClaim.claimItems;
  }
}
