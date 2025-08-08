import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailValidationService } from './email-validation.service';
import { EmailValidationController } from './email-validation.controller';
import { EmailStatus } from './entities/email-status.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([EmailStatus]), ConfigModule],
    controllers: [EmailValidationController],
    providers: [EmailValidationService],
    exports: [EmailValidationService] // Export if other modules need to use it
})
export class EmailValidationModule {}