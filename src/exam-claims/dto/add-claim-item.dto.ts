import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddClaimItemDto {
  @ApiProperty({
    example: 'Midterm Exam CSC3213',
    description: 'Name of the exam',
  })
  @IsString()
  @IsNotEmpty()
  examName: string;

  @ApiProperty({
    example: '2025-11-21',
    description: 'Date of the exam',
  })
  @IsString()
  @IsNotEmpty()
  examDate: string;

  @ApiProperty({
    example: 'E401',
    description: 'Venue of the exam',
  })
  @IsString()
  @IsNotEmpty()
  venue: string;

  @ApiProperty({
    example: 1500.0,
    description: 'Claim amount for the exam',
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the parent exam claim',
  })
  @IsNumber()
  claimId: number;
}
