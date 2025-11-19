import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ExamClaim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  faculty: string;

  @Column()
  position: string;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ name: 'branch_name' })
  branchName: string;

  @Column({ name: 'account_holder_name' })
  accountHolderName: string;

  @Column({ name: 'account_number' })
  accountNumber: string;

  @ManyToOne(() => User, (user) => user.examClaims)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
