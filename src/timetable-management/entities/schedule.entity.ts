
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
}

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  room_id: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ length: 50 })
  course_code: string;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  day_of_week: DayOfWeek;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'time' })
  end_time: string;
}
