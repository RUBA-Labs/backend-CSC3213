import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @Column({ default: false })
    isRead: boolean;

    @Column({ length: 255 })
    message: string;

    @Column('text')
    description: string;

    @CreateDateColumn()
    createdAt: Date;
}
