import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTestController } from './database-test.controller';
import { DatabaseTestService } from './database-test.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseTest } from './entities/database-test.entity';
import { ThrottlerModule } from '@nestjs/throttler';

describe('DatabaseTestController', () => {
    let controller: DatabaseTestController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ThrottlerModule.forRoot([{
                ttl: 60000,
                limit: 10,
            }])],
            controllers: [DatabaseTestController],
            providers: [
                DatabaseTestService,
                {
                    provide: getRepositoryToken(DatabaseTest),
                    useValue: {
                        // Mock your repository methods here
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                        findOneBy: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<DatabaseTestController>(DatabaseTestController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
