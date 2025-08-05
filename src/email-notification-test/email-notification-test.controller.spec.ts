import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationTestController } from './email-notification-test.controller';
import { EmailNotificationTestService } from './email-notification-test.service';

describe('EmailNotificationTestController', () => {
    let controller: EmailNotificationTestController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmailNotificationTestController],
            providers: [
                {
                    provide: EmailNotificationTestService,
                    useValue: {
                        sendEmail: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<EmailNotificationTestController>(
            EmailNotificationTestController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
