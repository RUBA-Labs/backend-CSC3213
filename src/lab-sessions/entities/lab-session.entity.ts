import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ComputerLab } from '../../computer-labs/entities/computer-lab.entity';

@Entity('lab_sessions')
export class LabSession {
    @PrimaryGeneratedColumn('uuid')
    sessionId: string;

    @Column({ type: 'varchar', length: 255 })
    sessionName: string;

    @Column({ type: 'date' })
    sessionDate: Date;

    @Column({ type: 'time' })
    sessionTime: string; // Store as string for simplicity, or use a more specific time type if needed

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    lecturer: string;

    @Column()
    labId: string; // Foreign key column

    @ManyToOne(() => ComputerLab)
    @JoinColumn({ name: 'labId' }) // Specify the foreign key column
    computerLab: ComputerLab;
}
