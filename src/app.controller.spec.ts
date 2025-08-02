import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AppController', () => {
    let appController: AppController;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [ThrottlerModule.forRoot([{
                ttl: 60000,
                limit: 10,
            }])],
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = moduleRef.get<AppController>(AppController);
    });

    describe('getHello', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});
