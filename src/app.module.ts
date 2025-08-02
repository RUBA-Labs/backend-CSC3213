import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseTestModule } from './database-test/database-test.module';

dotenv.config();

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
