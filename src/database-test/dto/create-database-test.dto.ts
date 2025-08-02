import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDatabaseTestDto {
    @ApiProperty({
        description: 'The name of the database test entry',
        example: 'Test Name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The description of the database test entry',
        example: 'This is a test description.',
        required: false,
    })
    @IsString()
    description?: string;
}
