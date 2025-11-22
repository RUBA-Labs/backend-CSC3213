import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseTestModule } from './database-test/database-test.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { EmailNotificationTestModule } from './email-notification-test/email-notification-test.module';
import { SessionModule } from './session/session.module';
import { EmailValidationModule } from './email-validation/email-validation.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { ComputerLabsModule } from './computer-labs/computer-labs.module';
import { ComputersModule } from './computers/computers.module';
import { LabSessionsModule } from './lab-sessions/lab-sessions.module';
import { LabBookingModule } from './lab-booking/lab-booking.module';
import { NotificationModule } from './notification/notification.module';
import { ExamClaimsModule } from './exam-claims/exam-claims.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { TimetableManagementModule } from './timetable-management/timetable-management.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Make the config module global
        }),
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 3,
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 20,
            },
        ]),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: true,
                retryAttempts: 3,
                retryDelay: 3000,
            }),
            inject: [ConfigService],
        }),
        DatabaseTestModule,
        UserModule,
        AuthModule,
        EmailNotificationTestModule,
        SessionModule,
        EmailValidationModule,
        UserProfileModule,
        PasswordResetModule,
        ComputerLabsModule,
        ComputersModule,
        LabSessionsModule,
        LabBookingModule,
        NotificationModule,
        ExamClaimsModule,
        AnnouncementsModule,
        TimetableManagementModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
