import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { LabSession } from '../../lab-sessions/entities/lab-session.entity';
import { Computer } from '../../computers/entities/computer.entity';
import { User } from '../../user/entities/user.entity';

@Entity('lab_bookings')
export class LabBooking {
    @PrimaryGeneratedColumn('uuid')
    bookingId: string;

    @Column()
    labSessionId: string;

    @ManyToOne(() => LabSession)
    @JoinColumn({ name: 'labSessionId' })
    labSession: LabSession;

    @Column()
    computerId: string;

    @ManyToOne(() => Computer)
    @JoinColumn({ name: 'computerId' })
    computer: Computer;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}
