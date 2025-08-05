import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationTestService } from './email-notification-test.service';

describe('EmailNotificationTestService', () => {
  let service: EmailNotificationTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailNotificationTestService],
    }).compile();

    service = module.get<EmailNotificationTestService>(EmailNotificationTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
