import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('NotificationController', () => {
    let controller: NotificationController;
    let notificationService: NotificationService;

    const mockNotificationService = {
        createNotification: jest.fn(),
        findAllByUser: jest.fn(),
        markAsRead: jest.fn(),
        markAsUnread: jest.fn(),
        findOneByIdAndUser: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationController],
            providers: [
                {
                    provide: NotificationService,
                    useValue: mockNotificationService,
                },
            ],
        })
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

        controller = module.get<NotificationController>(NotificationController);
        notificationService = module.get<NotificationService>(NotificationService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
