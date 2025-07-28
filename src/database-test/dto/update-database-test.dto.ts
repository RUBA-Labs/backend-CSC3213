import { PartialType } from '@nestjs/mapped-types';
import { CreateDatabaseTestDto } from './create-database-test.dto';

export class UpdateDatabaseTestDto extends PartialType(CreateDatabaseTestDto) {}
