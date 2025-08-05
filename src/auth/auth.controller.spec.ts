import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthSession } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { UserService } from '../user/user.service';
import { Role } from '../user/role.enum';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                UserService,
                JwtService,
                AuthService,
                UserService,
                JwtService,
                {
                    provide: AuthRepository,
                    useValue: {
                        saveSession: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(AuthSession),
                    useClass: Repository,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should return an access token and user information', async () => {
            const loginDto: LoginDto = {
                email: 'test@example.com',
                password: 'password',
            };
            const result = {
                access_token: 'some-token',
                user: {
                    id: 1,
                    email: 'test@example.com',
                    role: Role.STUDENT,
                },
            };
            jest.spyOn(authService, 'login').mockImplementation(() =>
                Promise.resolve(result),
            );

            expect(await controller.login(loginDto)).toBe(result);
        });
    });
});
