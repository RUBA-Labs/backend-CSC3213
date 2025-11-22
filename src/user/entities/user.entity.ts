import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';

import { Role } from '../role.enum';
import { ExamClaim } from '../../exam-claims/entities/exam-claim.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role })
    role: Role;

    @Column({ nullable: true })
    fullName?: string;

    @Column({ nullable: true })
    department?: string;

    @Column({ nullable: true })
    phone?: string;

    @OneToMany(() => ExamClaim, (examClaim) => examClaim.user)
    examClaims: ExamClaim[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
