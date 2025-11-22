
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column({ length: 10, nullable: true })
  location_code: string;

  @Column({ length: 50, nullable: true })
  room_name: string;
}
