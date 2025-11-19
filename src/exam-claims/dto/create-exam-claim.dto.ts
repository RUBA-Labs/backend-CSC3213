import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamClaimDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the claimant',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Faculty of Engineering',
    description: 'Faculty of the claimant',
  })
  @IsString()
  @IsNotEmpty()
  faculty: string;

  @ApiProperty({
    example: 'Lecturer',
    description: 'Position of the claimant',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    example: 'Bank of Ceylon',
    description: 'Name of the bank',
  })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({
    example: 'Colombo Main Branch',
    description: 'Name of the bank branch',
  })
  @IsString()
  @IsNotEmpty()
  branchName: string;

  @ApiProperty({
    example: 'J. Doe',
    description: 'Account holder name',
  })
  @IsString()
  @IsNotEmpty()
  accountHolderName: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Bank account number',
  })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}
