import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationTestController } from './email-notification-test.controller';

describe('EmailNotificationTestController', () => {
  let controller: EmailNotificationTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailNotificationTestController],
    }).compile();

    controller = module.get<EmailNotificationTestController>(EmailNotificationTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
