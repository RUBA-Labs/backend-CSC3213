import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { EmailValidationService } from '../email-validation/email-validation.service';

@Injectable()
export class UserService {
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly emailValidationService: EmailValidationService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
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
        const hash = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            ...createUserDto,
            password: hash,
        });
        return this.userRepository.save(user);
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
