import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Computer } from '../../computer/entities/computer.entity';

@Entity('bookings')
@Unique(['bookingDate', 'bookingTime', 'computerId'])
export class Booking {
    @PrimaryGeneratedColumn()
    bookingId: number;

    @Column()
    bookingDate: string;

    @Column()
    bookingTime: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @ManyToOne(() => Computer, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'computerId' })
    computer: Computer;

    @Column()
    computerId: number;
}
