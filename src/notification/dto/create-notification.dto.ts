import {
    IsString,
    IsNotEmpty,
    IsBoolean,
    IsOptional,
    IsNumber,
} from 'class-validator';

export class CreateNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    @IsOptional()
    isRead?: boolean;
}
