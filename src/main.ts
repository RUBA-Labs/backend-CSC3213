import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        app.enableCors(); // Enable CORS
        app.useGlobalPipes(new ValidationPipe()); // Enable validation pipe
        app.useGlobalFilters(new AllExceptionsFilter()); // Enable global exception filter

        const config = new DocumentBuilder()
            .setTitle('CSC3213 Backend API')
            .setDescription('The API documentation for the CSC3213 project.')
            .setVersion('1.0')
            .addTag('API')
            .addBearerAuth()
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document);

        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

        await app.listen(port);

        console.log(`🚀 Server running at http://localhost:${port}`);
        console.log(
            `📄 API documentation available at http://localhost:${port}/api`,
        );
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

void bootstrap();
