import { PartialType } from '@nestjs/swagger';
import { CreateLabSessionDto } from './create-lab-session.dto';

export class UpdateLabSessionDto extends PartialType(CreateLabSessionDto) {}
