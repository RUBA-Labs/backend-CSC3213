import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/role.enum';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) {}

    async createSession(
        user: User,
        jwtToken: string,
        ipAddress: string,
        userAgent: string,
    ): Promise<Session> {
        const session = this.sessionRepository.create({
            user,
            jwtToken,
            ipAddress,
            userAgent,
        });
        return this.sessionRepository.save(session);
    }

    async findSessionById(id: string): Promise<Session | null> {
        return this.sessionRepository.findOne({
            where: { id },
            relations: ['user'],
        });
    }

    async findSessionsByUser(userId: number): Promise<Session[]> {
        return this.sessionRepository.find({
            where: { user: { id: userId }, isRevoked: false },
        });
    }

    async findAllSessions(): Promise<Session[]> {
        return this.sessionRepository.find({
            where: { isRevoked: false },
            relations: ['user'],
        });
    }

    async revokeSession(
        id: string,
        user: { userId: number; role: string },
    ): Promise<void> {
        const session = await this.sessionRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!session) {
            throw new NotFoundException(`Session with ID ${id} not found`);
        }

        if (
            session.user.id !== user.userId &&
            (user.role as Role) !== Role.DEVELOPER
        ) {
            throw new UnauthorizedException(
                'You are not authorized to revoke this session',
            );
        }

        session.isRevoked = true;
        await this.sessionRepository.save(session);
    }

    async revokeAllSessionsForUser(userId: number): Promise<void> {
        await this.sessionRepository.update(
            { user: { id: userId } },
            { isRevoked: true },
        );
    }

    async updateLastUsedAt(id: string): Promise<void> {
        await this.sessionRepository.update(id, { lastUsedAt: new Date() });
    }

    async revokeAllUserSessions(): Promise<void> {
        await this.sessionRepository
            .createQueryBuilder()
            .update(Session)
            .set({ isRevoked: true })
            .where('userId IN (SELECT id FROM "user" WHERE role != :role)', {
                role: Role.DEVELOPER,
            })
            .execute();
    }

    async revokeSessionByJti(jti: string): Promise<void> {
        const session = await this.sessionRepository.findOne({
            where: { id: jti },
        });
        if (!session) {
            throw new NotFoundException(`Session with ID ${jti} not found`);
        }
        session.isRevoked = true;
        await this.sessionRepository.save(session);
    }

    async cleanRevokedSessions(): Promise<void> {
        await this.sessionRepository.delete({ isRevoked: true });
    }
}
