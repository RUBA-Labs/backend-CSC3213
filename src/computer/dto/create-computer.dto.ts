import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateComputerDto {
    @ApiProperty({ description: 'The name of the computer', example: 'PC-01' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The name of the PC', example: 'Dell Optiplex' })
    @IsString()
    @IsNotEmpty()
    pc_name: string;

    @ApiProperty({ description: 'The x-coordinate of the computer in the lab', example: 10.5 })
    @IsNumber()
    position_x: number;

    @ApiProperty({ description: 'The y-coordinate of the computer in the lab', example: 20.5 })
    @IsNumber()
    position_y: number;

    @ApiProperty({ description: 'The ID of the lab where the computer is located', example: 1 })
    @IsNumber()
    @Min(1)
    labId: number;
}
