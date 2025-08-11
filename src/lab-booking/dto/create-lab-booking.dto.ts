import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLabBookingDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'The ID of the lab session' })
  @IsUUID()
  @IsNotEmpty()
  labSessionId: string;

  @ApiProperty({ example: 'fedcba98-7654-3210-fedc-ba9876543210', description: 'The ID of the computer to book' })
  @IsUUID()
  @IsNotEmpty()
  computerId: string;
}
