import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ClaimItem } from './claim-item.entity';

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

  @OneToMany(() => ClaimItem, (claimItem) => claimItem.examClaim)
  claimItems: ClaimItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
