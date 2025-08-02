import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTestService } from './database-test.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DatabaseTest } from './entities/database-test.entity';

describe('DatabaseTestService', () => {
    let service: DatabaseTestService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<DatabaseTestService>(DatabaseTestService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
