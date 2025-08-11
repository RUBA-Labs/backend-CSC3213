import { PartialType } from '@nestjs/swagger';
import { CreateComputerLabDto } from './create-computer-lab.dto';

export class UpdateComputerLabDto extends PartialType(CreateComputerLabDto) {}
