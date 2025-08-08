import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../user/role.enum';
import { Session } from '../session/entities/session.entity';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';

import { Request } from 'express';

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
                SessionService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Session),
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

            const req = { ip: '127.0.0.1', headers: { 'user-agent': 'jest' } };

            expect(await controller.login(loginDto, req as Request)).toBe(
                result,
            );
        });
    });
});
