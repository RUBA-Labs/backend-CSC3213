import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTestController } from './database-test.controller';
import { DatabaseTestService } from './database-test.service';

describe('DatabaseTestController', () => {
  let controller: DatabaseTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseTestController],
      providers: [DatabaseTestService],
    }).compile();

    controller = module.get<DatabaseTestController>(DatabaseTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
