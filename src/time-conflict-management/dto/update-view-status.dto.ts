
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateViewStatusDto {
  @ApiProperty({ description: 'The new viewed status of the time conflict request', example: true })
  @IsBoolean()
  is_viewed: boolean;
}
