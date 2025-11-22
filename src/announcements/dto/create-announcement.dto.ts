import { IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/role.enum';

const allRoles = Object.values(Role);
const allowedViewerValues = [...allRoles, 'ALL'];

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'The title of the announcement',
    minLength: 5,
    example: 'Important: System Maintenance',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({
    description: 'The main content of the announcement',
    minLength: 10,
    example: 'There will be a scheduled system maintenance on Sunday.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  message: string;

  @ApiProperty({
    description: 'The target audience for the announcement. Can be a specific role or "ALL".',
    enum: allowedViewerValues,
    example: 'student',
  })
  @IsNotEmpty()
  @IsIn(allowedViewerValues)
  selectedViewer: string;
}
