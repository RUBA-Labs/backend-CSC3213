import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('email_status')
export class EmailStatus {
    @PrimaryColumn()
    email: string;

    @Column({ default: false })
    isValidated: boolean;
}
