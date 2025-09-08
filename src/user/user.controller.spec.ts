/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ThrottlerModule } from '@nestjs/throttler';

describe('UserController', () => {
    let controller: UserController;
    let service: UserService;

    const mockUserService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ThrottlerModule.forRoot([
                    {
                        ttl: 60000,
                        limit: 10,
                    },
                ]),
            ],
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password',
                fullName: 'Test User',
            };

            mockUserService.create.mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                fullName: 'Test User',
            });

            expect(await controller.create(createUserDto)).toEqual({
                id: expect.any(Number),
                email: 'test@example.com',
                fullName: 'Test User',
            });
            expect(service.create).toHaveBeenCalledWith(createUserDto);
        });
    });
});
