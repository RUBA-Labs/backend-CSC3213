import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailValidationService } from '../email-validation/email-validation.service';
import { ConfigService } from '@nestjs/config';
import { Role } from './role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('UserService', () => {
    let service: UserService;

    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockEmailValidationService = {
        getEmailStatus: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn((key: string) => {
            if (key === 'FIRST_YEAR_STUDENT_EMAIL_PREFIX') {
                return 'stf';
            }
            if (key === 'STUDENT_EMAIL_PREFIX') {
                return 'st';
            }
            return null;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: EmailValidationService,
                    useValue: mockEmailValidationService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user with FIRST_YEAR_STUDENT role for "stf" prefix', async () => {
            const createUserDto: CreateUserDto = {
                email: 'stfnnew@gmail.com',
                password: 'password',
                fullName: 'Test User',
            };

            mockEmailValidationService.getEmailStatus.mockResolvedValue({ isValidated: true });
            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(createUserDto);
            mockUserRepository.save.mockResolvedValue({ ...createUserDto, id: 1, role: Role.FIRST_YEAR_STUDENT });

            const result = await service.create(createUserDto);

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                role: Role.FIRST_YEAR_STUDENT,
            }));

            expect(result).toEqual({
                id: 1,
                email: 'stfnnew@gmail.com',
                fullName: 'Test User',
            });
        });

        it('should create a user with STUDENT role for "st" prefix', async () => {
            const createUserDto: CreateUserDto = {
                email: 'stnew@gmail.com',
                password: 'password',
                fullName: 'Test User',
            };

            mockEmailValidationService.getEmailStatus.mockResolvedValue({ isValidated: true });
            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(createUserDto);
            mockUserRepository.save.mockResolvedValue({ ...createUserDto, id: 1, role: Role.STUDENT });

            const result = await service.create(createUserDto);

            expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                role: Role.STUDENT,
            }));

            expect(result).toEqual({
                id: 1,
                email: 'stnew@gmail.com',
                fullName: 'Test User',
            });
        });

        it('should throw BadRequestException if email is not validated', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password',
                fullName: 'Test User',
            };

            mockEmailValidationService.getEmailStatus.mockResolvedValue({ isValidated: false });

            await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException if user already exists', async () => {
            const createUserDto: CreateUserDto = {
                email: 'test@example.com',
                password: 'password',
                fullName: 'Test User',
            };

            mockEmailValidationService.getEmailStatus.mockResolvedValue({ isValidated: true });
            mockUserRepository.findOne.mockResolvedValue({ id: 1, ...createUserDto });

            await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
        });
    });
});
