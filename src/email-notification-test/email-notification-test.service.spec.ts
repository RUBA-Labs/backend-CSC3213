import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationTestService } from './email-notification-test.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailLog } from './entities/email-log.entity';
import { ConfigService } from '@nestjs/config';

describe('EmailNotificationTestService', () => {
    let service: EmailNotificationTestService;
    let mockConfigService: Partial<ConfigService>;

    beforeEach(async () => {
        mockConfigService = {
            get: jest.fn((key: string) => {
                if (key === 'EMAIL_USER') return 'test@example.com';
                if (key === 'APP_PASSWORD') return 'testpassword';
                return null;
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmailNotificationTestService,
                {
                    provide: getRepositoryToken(EmailLog),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<EmailNotificationTestService>(
            EmailNotificationTestService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
