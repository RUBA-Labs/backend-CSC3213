
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto, DayOfWeek } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class TimetableManagementService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  // Schedule CRUD
  createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(createScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  findAllSchedules(): Promise<Schedule[]> {
    return this.scheduleRepository.find({ relations: ['room'] });
  }

  async findScheduleByDayAndTime(day: DayOfWeek, time: string) {
    return this.scheduleRepository
      .createQueryBuilder('s')
      .select([
        's.id',
        'r.location_code',
        'r.room_name',
        's.course_code',
        's.start_time',
        's.end_time',
      ])
      .innerJoin('s.room', 'r')
      .where('s.day_of_week = :day', { day })
      .andWhere('s.start_time = :time', { time })
      .getRawMany();
  }

  async findOneSchedule(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id }, relations: ['room'] });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async updateSchedule(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.scheduleRepository.preload({
      id,
      ...updateScheduleDto,
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return this.scheduleRepository.save(schedule);
  }

  async removeSchedule(id: number): Promise<void> {
    const result = await this.scheduleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
  }

  // Room CRUD
  createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  findAllRooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findOneRoom(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { room_id: id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async updateRoom(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.roomRepository.preload({
      room_id: id,
      ...updateRoomDto,
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return this.roomRepository.save(room);
  }

  async removeRoom(id: number): Promise<void> {
    const result = await this.roomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}
