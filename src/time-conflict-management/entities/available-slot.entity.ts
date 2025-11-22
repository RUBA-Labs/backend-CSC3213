
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimeConflict } from './time-conflict.entity';

@Entity('available_slots')
export class AvailableSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column()
  time_conflict_id: number;

  @ManyToOne(() => TimeConflict, (timeConflict) => timeConflict.availableSlots)
  @JoinColumn({ name: 'time_conflict_id' })
  timeConflict: TimeConflict;
}
