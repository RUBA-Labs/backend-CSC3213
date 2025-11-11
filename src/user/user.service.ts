import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailValidationService } from '../email-validation/email-validation.service';
import { ConfigService } from '@nestjs/config';
import { Role } from './role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly emailValidationService: EmailValidationService,
        private readonly configService: ConfigService,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(
        createUserDto: CreateUserDto,
    ): Promise<{ id: number; email: string; fullName: string | undefined }> {
        const emailStatus = await this.emailValidationService.getEmailStatus(
            createUserDto.email,
        );

        if (!emailStatus || !emailStatus.isValidated) {
            throw new BadRequestException('Email is not validated.');
        }

        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const { developerSecret, ...userData } = createUserDto;
        const role = this.determineRole(userData.email, developerSecret);

        const hash = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hash,
            role,
        });

        const savedUser = await this.userRepository.save(user);
        return {
            id: savedUser.id,
            email: savedUser.email,
            fullName: savedUser.fullName,
        };
    }

    private determineRole(email: string, developerSecret?: string): Role {
        const devSecret = this.configService
            .get<string>('DEVELOPER_SECRET')
            ?.trim();
        if (devSecret && developerSecret === devSecret) {
            return Role.DEVELOPER;
        }

        const firstYearPrefix = this.configService.get<string>(
            'FIRST_YEAR_STUDENT_EMAIL_PREFIX',
        );
        if (firstYearPrefix && email.startsWith(firstYearPrefix)) {
            return Role.FIRST_YEAR_STUDENT;
        }

        const studentPrefix = this.configService.get<string>(
            'STUDENT_EMAIL_PREFIX',
        );
        if (studentPrefix && email.startsWith(studentPrefix)) {
            return Role.STUDENT;
        }

        return Role.USER;
    }

    async searchByRole(
        role: string,
        page: number,
    ): Promise<{ users: User[]; haveMoreUsers: boolean }> {
        const limit = 15;
        const offset = (page - 1) * limit;

        const queryBuilder = this.userRepository.createQueryBuilder('user');

        const [users, total] = await queryBuilder
            .where('user.role LIKE :role', { role: `%${role}%` })
            .skip(offset)
            .take(limit)
            .getManyAndCount();

        const haveMoreUsers = page * limit < total;

        return { users, haveMoreUsers };
    }

    async searchByEmail(
        email: string,
        page: number,
    ): Promise<{ users: User[]; haveMoreUsers: boolean }> {
        const limit = 15;
        const offset = (page - 1) * limit;

        const [users, total] = await this.userRepository.findAndCount({
            where: {
                email: Like(`%${email}%`),
            },
            skip: offset,
            take: limit,
        });

        const haveMoreUsers = page * limit < total;

        return { users, haveMoreUsers };
    }

    async searchByName(
        name: string,
        page: number,
    ): Promise<{ users: User[]; haveMoreUsers: boolean }> {
        const limit = 15;
        const offset = (page - 1) * limit;

        const [users, total] = await this.userRepository.findAndCount({
            where: {
                fullName: Like(`%${name}%`),
            },
            skip: offset,
            take: limit,
        });

        const haveMoreUsers = page * limit < total;

        return { users, haveMoreUsers };
    }

    async findPaged(
        page: number,
    ): Promise<{ users: User[]; haveMoreUsers: boolean }> {
        const limit = 15;
        const offset = (page - 1) * limit;

        const [users, total] = await this.userRepository.findAndCount({
            skip: offset,
            take: limit,
        });

        const haveMoreUsers = page * limit < total;

        return { users, haveMoreUsers };
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException(`User with ID ${id} not found`);
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(
                updateUserDto.password,
                10,
            );
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}
