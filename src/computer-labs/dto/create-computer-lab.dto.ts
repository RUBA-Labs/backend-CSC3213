import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateComputerLabDto {
    @ApiProperty({
        description: 'A brief description of the computer lab.',
        example: 'Main computer lab for students.',
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'The location of the computer lab.',
        example: 'Building A, Room 101',
    })
    @IsString()
    location: string;

    @ApiProperty({
        description: 'The total number of computers available in the lab.',
        example: 50,
    })
    @IsInt()
    @Min(0)
    computersAvailable: number;

    @ApiProperty({
        description: 'The number of computers that are currently working.',
        example: 45,
    })
    @IsInt()
    @Min(0)
    computersWorking: number;

    @ApiProperty({
        description: 'The number of computers that are currently disabled.',
        example: 5,
    })
    @IsInt()
    @Min(0)
    computersDisable: number;
}
