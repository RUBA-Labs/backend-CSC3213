import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserService } from '../user/user.service';

describe('NotificationService', () => {
    let service: NotificationService;
    let notificationRepository: any;
    let userService: any;

    const mockNotificationRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserService = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: getRepositoryToken(Notification),
                    useValue: mockNotificationRepository,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
        notificationRepository = module.get(getRepositoryToken(Notification));
        userService = module.get(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
