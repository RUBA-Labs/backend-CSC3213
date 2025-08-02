import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthSession } from './auth.entity';

@Injectable()
export class AuthRepository extends Repository<AuthSession> {
  constructor(private dataSource: DataSource) {
    super(AuthSession, dataSource.createEntityManager());
  }

  async saveSession(userId: number, jwtToken: string): Promise<AuthSession> {
    const session = this.create({ userId, jwtToken });
    return this.save(session);
  }
}
