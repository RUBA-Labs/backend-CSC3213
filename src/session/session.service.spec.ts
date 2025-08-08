import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/role.enum';
import { UnauthorizedException } from '@nestjs/common';

describe('SessionService', () => {
    let service: SessionService;
    let repository: Repository<Session>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SessionService,
                {
                    provide: getRepositoryToken(Session),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<SessionService>(SessionService);
        repository = module.get<Repository<Session>>(
            getRepositoryToken(Session),
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('revokeSession', () => {
        it('should allow a user to revoke their own session', async () => {
            const user = { userId: 1, role: Role.STUDENT };
            const session = new Session();
            session.id = 'some-uuid';
            session.user = { id: 1 } as User;
            jest.spyOn(repository, 'findOne').mockResolvedValue(session);
            jest.spyOn(repository, 'save').mockResolvedValue(session);

            await service.revokeSession('some-uuid', user);
            expect(session.isRevoked).toBe(true);
        });

        it('should allow a developer to revoke any session', async () => {
            const user = { userId: 2, role: Role.DEVELOPER };
            const session = new Session();
            session.id = 'some-uuid';
            session.user = { id: 1 } as User;
            jest.spyOn(repository, 'findOne').mockResolvedValue(session);
            jest.spyOn(repository, 'save').mockResolvedValue(session);

            await service.revokeSession('some-uuid', user);
            expect(session.isRevoked).toBe(true);
        });

        it("should not allow a user to revoke another user's session", async () => {
            const user = { userId: 2, role: Role.STUDENT };
            const session = new Session();
            session.id = 'some-uuid';
            session.user = { id: 1 } as User;
            jest.spyOn(repository, 'findOne').mockResolvedValue(session);

            await expect(
                service.revokeSession('some-uuid', user),
            ).rejects.toThrow(
                new UnauthorizedException(
                    'You are not authorized to revoke this session',
                ),
            );
        });
    });
});
