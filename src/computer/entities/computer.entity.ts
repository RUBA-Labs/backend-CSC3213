import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lab } from 'src/lab-allocation/entities/lab.entity';

@Entity('computers')
export class Computer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    pc_name: string;

    @Column('float')
    position_x: number;

    @Column('float')
    position_y: number;

    @ManyToOne(() => Lab, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'labId' })
    lab: Lab;

    @Column()
    labId: number;
}
