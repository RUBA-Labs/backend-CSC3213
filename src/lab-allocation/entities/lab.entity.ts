import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('labs') // Table name will be 'labs'
export class Lab {
    @PrimaryGeneratedColumn() // Auto-incrementing primary key
    labId: number;

    @Column()
    labName: string;

    @Column()
    date: string;

    @Column()
    time: string;

    @Column()
    numberOfComputers: number;

    @Column()
    lecturerName: string;
}
