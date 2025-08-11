import { Injectable, NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Computer } from '../computer/entities/computer.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/role.enum';

@Injectable()
export class LabBookingService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepository: Repository<Booking>,
        @InjectRepository(Computer)
        private readonly computerRepository: Repository<Computer>,
    ) {}

    async create(createBookingDto: CreateBookingDto, userId: number): Promise<Booking> {
        const { computerId, bookingDate, bookingTime } = createBookingDto;

        const computer = await this.computerRepository.findOneBy({ id: computerId });
        if (!computer) {
            throw new NotFoundException(`Computer with ID ${computerId} not found`);
        }

        const existingBooking = await this.bookingRepository.findOne({
            where: { computerId, bookingDate, bookingTime },
        });

        if (existingBooking) {
            throw new ConflictException('This computer is already booked for the specified date and time.');
        }

        const booking = this.bookingRepository.create({
            ...createBookingDto,
            userId,
        });

        return this.bookingRepository.save(booking);
    }

    async remove(bookingId: number, userId: number, roles: string[]): Promise<void> {
        const booking = await this.bookingRepository.findOneBy({ bookingId });

        if (!booking) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }

        const isOwner = booking.userId === userId;
        const isAdmin = roles.includes(Role.ADMIN) || roles.includes(Role.DEVELOPER) || roles.includes(Role.LAB_ALLOCATION_ADMIN);

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException('You are not authorized to delete this booking');
        }

        const result = await this.bookingRepository.delete(bookingId);

        if (result.affected === 0) {
            throw new NotFoundException(`Booking with ID ${bookingId} not found`);
        }
    }

    async findAllAvailableComputers(bookingDate: string, bookingTime: string): Promise<Computer[]> {
        const bookedComputers = await this.bookingRepository.find({
            where: { bookingDate, bookingTime },
            relations: ['computer'],
        });

        const bookedComputerIds = bookedComputers.map((booking) => booking.computer.id);

        const allComputers = await this.computerRepository.find();

        const availableComputers = allComputers.filter(
            (computer) => !bookedComputerIds.includes(computer.id),
        );

        return availableComputers;
    }

    async findAllBookedComputers(bookingDate: string, bookingTime: string): Promise<Booking[]> {
        return this.bookingRepository.find({
            where: { bookingDate, bookingTime },
            relations: ['computer', 'user'],
        });
    }
}