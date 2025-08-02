import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { ThrottlerModule } from '@nestjs/throttler';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ThrottlerModule.forRoot([{
                ttl: 60000,
                limit: 10,
            }]),
            ],
            controllers: [UserController],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
