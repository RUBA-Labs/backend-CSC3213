import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ComputerStatus } from '../entities/computer.entity';

export class CreateComputerDto {
    @ApiProperty({
        description: 'The ID of the computer lab this computer belongs to.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    })
    @IsUUID()
    labId: string;

    @ApiProperty({
        description: 'The status of the computer (functional or faulty).',
        enum: ComputerStatus,
        default: ComputerStatus.functional,
    })
    @IsEnum(ComputerStatus)
    @IsOptional()
    status?: ComputerStatus;

    @ApiProperty({
        description: 'A brief description of the computer.',
        example: 'Dell OptiPlex 7010, i7, 16GB RAM',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The name of the computer.',
        example: 'Lab-A-PC-01',
    })
    @IsString()
    name: string;
}
