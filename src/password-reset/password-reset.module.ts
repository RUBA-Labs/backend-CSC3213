import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { EmailValidationModule } from '../email-validation/email-validation.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [EmailValidationModule, UserModule],
    controllers: [PasswordResetController],
    providers: [PasswordResetService],
})
export class PasswordResetModule {}
