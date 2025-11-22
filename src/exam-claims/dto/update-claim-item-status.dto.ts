
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClaimItemStatusValue } from '../entities/claim-item-status.enum';

export class UpdateClaimItemStatusDto {
  @ApiProperty({
    enum: ClaimItemStatusValue,
    description: 'The new status for the claim item',
    example: ClaimItemStatusValue.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(ClaimItemStatusValue)
  newStatus: ClaimItemStatusValue;
}
