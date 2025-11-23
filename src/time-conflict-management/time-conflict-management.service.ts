
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeConflict } from './entities/time-conflict.entity';
import { AvailableSlot } from './entities/available-slot.entity';
import { CreateTimeConflictDto } from './dto/create-time-conflict.dto';

@Injectable()
export class TimeConflictManagementService {
  constructor(
    @InjectRepository(TimeConflict)
    private readonly timeConflictRepository: Repository<TimeConflict>,
    @InjectRepository(AvailableSlot)
    private readonly availableSlotRepository: Repository<AvailableSlot>,
  ) {}

  async createTimeConflict(createTimeConflictDto: CreateTimeConflictDto, userId: number): Promise<TimeConflict> {
    const { available_slots, ...timeConflictData } = createTimeConflictDto;

    const timeConflict = this.timeConflictRepository.create({
      ...timeConflictData,
      request_create_user_id: userId,
    });

    const savedTimeConflict = await this.timeConflictRepository.save(timeConflict);

    if (available_slots && available_slots.length > 0) {
      const slots = available_slots.map((slot) =>
        this.availableSlotRepository.create({
          ...slot,
          timeConflict: savedTimeConflict,
        }),
      );
      await this.availableSlotRepository.save(slots);
    }

    return (await this.timeConflictRepository.findOne({
      where: { id: savedTimeConflict.id },
      relations: ['availableSlots'],
    }))!;
  }

  async findAllTimeConflicts(): Promise<TimeConflict[]> {
    return this.timeConflictRepository.find({
      relations: ['availableSlots', 'requestByUser'], // Load related entities
    });
  }

  async updateViewStatus(id: number, isViewed: boolean): Promise<TimeConflict> {
    const timeConflict = await this.timeConflictRepository.findOne({ where: { id } });

    if (!timeConflict) {
      throw new NotFoundException(`Time Conflict Request with ID ${id} not found`);
    }

    timeConflict.is_viewed = isViewed;
    return this.timeConflictRepository.save(timeConflict);
  }
}
