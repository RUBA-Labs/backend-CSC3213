import { PartialType } from '@nestjs/swagger';
import { CreateDatabaseTestDto } from './create-database-test.dto';

export class UpdateDatabaseTestDto extends PartialType(CreateDatabaseTestDto) {}
