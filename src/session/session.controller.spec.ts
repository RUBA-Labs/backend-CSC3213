import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../user/role.enum';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

describe('SessionController', () => {
    let controller: SessionController;

    const mockSessionService = {
        findSessionsByUser: jest.fn().mockResolvedValue([]),
        findAllSessions: jest.fn().mockResolvedValue([]),
        revokeSession: jest.fn().mockResolvedValue(undefined),
        revokeAllSessionsForUser: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        mockSessionService.findSessionsByUser.mockClear();
        mockSessionService.findAllSessions.mockClear();
        mockSessionService.revokeSession.mockClear();
        mockSessionService.revokeAllSessionsForUser.mockClear();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [SessionController],
            providers: [
                {
                    provide: SessionService,
                    useValue: mockSessionService,
                },
            ],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<SessionController>(SessionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getSessions', () => {
        it('should return sessions for the current user', async () => {
            const req = {
                user: { userId: 1, role: Role.STUDENT, jti: 'some-jti' },
                headers: {},
                connection: {},
                socket: {},
                params: {},
                query: {},
                body: {},
            } as any as AuthenticatedRequest;
            await controller.getSessions(req);
            expect(mockSessionService.findSessionsByUser).toHaveBeenCalledWith(
                1,
            );
        });
    });

    describe('getAllSessions', () => {
        it('should return all sessions for a developer', async () => {
            await controller.getAllSessions();
            expect(mockSessionService.findAllSessions).toHaveBeenCalled();
        });
    });

    describe('logout', () => {
        it('should revoke a session', async () => {
            const req = {
                user: { userId: 1, role: Role.STUDENT, jti: 'some-jti' },
                headers: {},
                connection: {},
                socket: {},
                params: {},
                query: {},
                body: {},
            } as any as AuthenticatedRequest;
            await controller.logout('some-uuid', req);
            expect(mockSessionService.revokeSession).toHaveBeenCalledWith(
                'some-uuid',
                req.user,
            );
        });
    });

    describe('logoutAllUserSessions', () => {
        it('should revoke all sessions for a specific user', async () => {
            await controller.logoutAllUserSessions(1);
            expect(
                mockSessionService.revokeAllSessionsForUser,
            ).toHaveBeenCalledWith(1);
        });
    });

    describe('logoutAll', () => {
        it('should revoke all sessions for the current user', async () => {
            const req = {
                user: { userId: 1, role: Role.STUDENT, jti: 'some-jti' },
                headers: {},
                connection: {},
                socket: {},
                params: {},
                query: {},
                body: {},
            } as any as AuthenticatedRequest;
            await controller.logoutAll(req);
            expect(
                mockSessionService.revokeAllSessionsForUser,
            ).toHaveBeenCalledWith(1);
        });
    });
});
