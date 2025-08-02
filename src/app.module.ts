import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseTestModule } from './database-test/database-test.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';

dotenv.config();

@Module({
    imports: [
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
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true, // auto-load entities registered via TypeOrmModule.forFeature()
            synchronize: true, // ⚠️ Disable this in production to avoid data loss
        }),
        DatabaseTestModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
