import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../user/role.enum';
import { SessionService } from '../session/session.service';
import { Session } from '../session/entities/session.entity';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let jwtService: JwtService;
    let sessionService: SessionService;
    let sessionRepository: Repository<Session>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: {
                        findByEmail: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
                {
                    provide: SessionService,
                    useValue: {
                        createSession: jest.fn(),
                        updateLastUsedAt: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Session),
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        sessionService = module.get<SessionService>(SessionService);
        sessionRepository = module.get<Repository<Session>>(
            getRepositoryToken(Session),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user if validation is successful', async () => {
            const user = new User();
            user.email = 'test@example.com';
            user.password = await bcrypt.hash('password', 10);

            (userService.findByEmail as jest.Mock).mockResolvedValue(user);

            const result = await service.validateUser(
                'test@example.com',
                'password',
            );
            expect(result).toEqual(user);
        });

        it('should return null if user not found', async () => {
            (userService.findByEmail as jest.Mock).mockResolvedValue(null);

            const result = await service.validateUser(
                'test@example.com',
                'password',
            );
            expect(result).toBeNull();
        });

        it('should return null if password does not match', async () => {
            const user = new User();
            user.email = 'test@example.com';
            user.password = await bcrypt.hash('password', 10);

            (userService.findByEmail as jest.Mock).mockResolvedValue(user);

            const result = await service.validateUser(
                'test@example.com',
                'wrongpassword',
            );
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access token and user info on successful login', async () => {
            const user = new User();
            user.id = 1;
            user.email = 'test@example.com';
            user.role = Role.STUDENT;

            const session = new Session();
            session.id = 'some-uuid';

            jest.spyOn(service, 'validateUser').mockResolvedValue(user);
            (jwtService.sign as jest.Mock).mockReturnValue('test-token');
            (sessionService.createSession as jest.Mock).mockResolvedValue(
                session,
            );
            (sessionRepository.save as jest.Mock).mockResolvedValue(session);

            const result = await service.login(
                {
                    email: 'test@example.com',
                    password: 'password',
                },
                '127.0.0.1',
                'jest',
            );

            expect(result).toEqual({
                access_token: 'test-token',
                user: {
                    id: 1,
                    email: 'test@example.com',
                    role: Role.STUDENT,
                },
            });
        });

        it('should throw UnauthorizedException on invalid credentials', async () => {
            jest.spyOn(service, 'validateUser').mockResolvedValue(null);

            await expect(
                service.login(
                    {
                        email: 'test@example.com',
                        password: 'wrongpassword',
                    },
                    '127.0.0.1',
                    'jest',
                ),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
