import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateBookingDto {
    @ApiProperty()
    @IsInt()
    computerId: number;

    @ApiProperty()
    @IsString()
    bookingDate: string;

    @ApiProperty()
    @IsString()
    bookingTime: string;
}
