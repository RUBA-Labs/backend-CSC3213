import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EmailLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column()
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}