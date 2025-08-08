import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { SessionService } from '../session/session.service';
import { Session } from '../session/entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private sessionService: SessionService,
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const newSession = await this.sessionService.createSession(
            user,
            '',
            ipAddress,
            userAgent,
        );
        const payload = { sub: user.id, role: user.role, jti: newSession.id };
        const finalToken = this.jwtService.sign(payload);

        newSession.jwtToken = finalToken;
        await this.sessionRepository.save(newSession);

        return {
            access_token: finalToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
}
