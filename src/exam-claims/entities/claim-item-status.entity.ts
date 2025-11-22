import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClaimItem } from './claim-item.entity';
import { ClaimItemStatusValue } from './claim-item-status.enum';

@Entity()
export class ClaimItemStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ClaimItemStatusValue,
    default: ClaimItemStatusValue.PENDING,
  })
  status: ClaimItemStatusValue;

  @OneToOne(() => ClaimItem, (claimItem) => claimItem.status, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claim_item_id' })
  claimItem: ClaimItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
