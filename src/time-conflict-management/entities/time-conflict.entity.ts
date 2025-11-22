
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity'; // Assuming User entity path
import { AvailableSlot } from './available-slot.entity';

@Entity('time_conflicts')
export class TimeConflict {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  course_code: string;

  @Column({ type: 'date' })
  original_date: Date;

  @Column({ type: 'time' })
  original_time: string;

  @Column()
  reason_description: string;

  @Column()
  request_create_user_id: number;

  @ManyToOne(() => User, (user) => user.timeConflicts)
  @JoinColumn({ name: 'request_create_user_id' })
  requestByUser: User;

  @OneToMany(() => AvailableSlot, (availableSlot) => availableSlot.timeConflict, { cascade: true })
  availableSlots: AvailableSlot[];
}
