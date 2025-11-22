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
import { UpdateClaimItemStatusDto } from './dto/update-claim-item-status.dto';

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

  async updateClaimItemStatus(
    id: number,
    updateClaimItemStatusDto: UpdateClaimItemStatusDto,
  ): Promise<ClaimItemStatus> {
    const { newStatus } = updateClaimItemStatusDto;

    const claimItem = await this.claimItemRepository.findOne({
      where: { id },
      relations: ['status'],
    });

    if (!claimItem) {
      throw new NotFoundException(`ClaimItem with ID ${id} not found`);
    }

    if (!claimItem.status) {
      // This case should ideally not happen if a status is always created with a claim item.
      // However, to handle this gracefully:
      const newStatusEntity = this.claimItemStatusRepository.create({
        status: newStatus,
        claimItem: claimItem,
      });
      return this.claimItemStatusRepository.save(newStatusEntity);
    }

    claimItem.status.status = newStatus;
    return this.claimItemStatusRepository.save(claimItem.status);
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

  async getAllExamClaims(): Promise<ExamClaim[]> {
    return this.examClaimsRepository.find({
      relations: ['user', 'claimItems', 'claimItems.status'],
    });
  }

  async getAllClaimItems(): Promise<ClaimItem[]> {
    return this.claimItemRepository.find({
      relations: ['examClaim', 'examClaim.user', 'status'],
    });
  }

  async getClaimItemsForCurrentUser(userId: number): Promise<any[]> {
    const claimItems = await this.claimItemRepository
      .createQueryBuilder('claimItem')
      .leftJoinAndSelect('claimItem.examClaim', 'examClaim')
      .leftJoinAndSelect('examClaim.user', 'user')
      .leftJoinAndSelect('claimItem.status', 'status')
      .where('user.id = :userId', { userId })
      .select([
        'claimItem.id AS id',
        'claimItem.examName AS "Exam Name/Code"',
        'claimItem.examDate AS "Exam Date"',
        'claimItem.venue AS Venue',
        'claimItem.amount AS Amount',
        'status.status AS Status',
        'examClaim.id AS claimId', // Foreign key from ExamClaim
      ])
      .getRawMany();

    return claimItems;
  }
}
