import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ComputerLab } from '../../computer-labs/entities/computer-lab.entity';

export enum ComputerStatus {
    ENABLED = 'enabled',
    DISABLED = 'disabled',
}

@Entity('computers')
export class Computer {
    @PrimaryGeneratedColumn('uuid')
    computerId: string;

    @Column()
    labId: string; // Foreign key column

    @ManyToOne(() => ComputerLab)
    @JoinColumn({ name: 'labId' }) // Specify the foreign key column
    computerLab: ComputerLab;

    @Column({
        type: 'enum',
        enum: ComputerStatus,
        default: ComputerStatus.ENABLED,
    })
    status: ComputerStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;
}
