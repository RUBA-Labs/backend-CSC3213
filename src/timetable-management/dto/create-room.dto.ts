
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ description: 'The location code', example: 'C-01' })
  @IsString()
  @IsNotEmpty()
  location_code: string;

  @ApiProperty({ description: 'The room name', example: 'Computer Lab 1' })
  @IsString()
  @IsNotEmpty()
  room_name: string;
}
