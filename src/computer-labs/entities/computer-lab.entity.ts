import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('computer_labs')
export class ComputerLab {
    @PrimaryGeneratedColumn('uuid')
    labId: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 100 })
    location: string;

    @Column({ type: 'int' })
    computersAvailable: number;

    @Column({ type: 'int' })
    computersWorking: number;

    @Column({ type: 'int' })
    computersDisable: number;
}
