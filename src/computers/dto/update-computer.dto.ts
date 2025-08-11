import { PartialType } from '@nestjs/swagger';
import { CreateComputerDto } from './create-computer.dto';

export class UpdateComputerDto extends PartialType(CreateComputerDto) {}
