import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTestService } from './database-test.service';

describe('DatabaseTestService', () => {
  let service: DatabaseTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseTestService],
    }).compile();

    service = module.get<DatabaseTestService>(DatabaseTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
