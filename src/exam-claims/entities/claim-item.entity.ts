import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExamClaim } from './exam-claim.entity';

@Entity()
export class ClaimItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_name' })
  examName: string;

  @Column({ type: 'date', name: 'exam_date' })
  examDate: string;

  @Column()
  venue: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => ExamClaim, (examClaim) => examClaim.claimItems)
  @JoinColumn({ name: 'claim_id' })
  examClaim: ExamClaim;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
