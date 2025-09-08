import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabBooking } from './entities/lab-booking.entity';
import { LabSession } from '../lab-sessions/entities/lab-session.entity';
import { Computer } from '../computers/entities/computer.entity';
import { LabSessionBookingStatus } from './interfaces/lab-session-booking-status.interface';

@Injectable()
export class LabBookingService {
    constructor(
        @InjectRepository(LabBooking)
        private labBookingRepository: Repository<LabBooking>,
        @InjectRepository(LabSession)
        private labSessionRepository: Repository<LabSession>,
        @InjectRepository(Computer)
        private computerRepository: Repository<Computer>,
    ) {}

    async getLabSessionBookingStatus(
        labSessionId: string,
    ): Promise<LabSessionBookingStatus> {
        const labSession = await this.labSessionRepository.findOne({
            where: { sessionId: labSessionId },
        });

        if (!labSession) {
            throw new NotFoundException(
                `Lab session with ID ${labSessionId} not found`,
            );
        }

        const computersInLab = await this.computerRepository.find({
            where: { labId: labSession.labId },
        });

        const bookingStatus = await Promise.all(
            computersInLab.map(async (computer) => {
                const booking = await this.labBookingRepository.findOne({
                    where: {
                        labSessionId: labSessionId,
                        computerId: computer.computerId,
                    },
                });

                return {
                    computerId: computer.computerId,
                    computerName: computer.name,
                    isBooked: !!booking,
                    bookedByUserId: booking ? booking.userId : null,
                    bookingId: booking ? booking.bookingId : null,
                };
            }),
        );

        return {
            labSessionId: labSession.sessionId,
            labSessionName: labSession.sessionName,
            labId: labSession.labId,
            bookingDetails: bookingStatus,
        };
    }

    async bookComputer(
        labSessionId: string,
        computerId: string,
        userId: string,
    ): Promise<LabBooking> {
        // 1. Check if lab session and computer exist
        const labSession = await this.labSessionRepository.findOne({
            where: { sessionId: labSessionId },
        });
        if (!labSession) {
            throw new NotFoundException(
                `Lab session with ID ${labSessionId} not found`,
            );
        }

        const computer = await this.computerRepository.findOne({
            where: { computerId: computerId },
        });
        if (!computer) {
            throw new NotFoundException(
                `Computer with ID ${computerId} not found`,
            );
        }

        // 2. Check if the computer is already booked for this session
        const existingBooking = await this.labBookingRepository.findOne({
            where: {
                labSessionId: labSessionId,
                computerId: computerId,
            },
        });

        if (existingBooking) {
            throw new ConflictException(
                `Computer ${computerId} is already booked for lab session ${labSessionId}`,
            );
        }

        // 3. Create new booking
        const newBooking = this.labBookingRepository.create({
            labSessionId,
            computerId,
            userId,
        });

        return this.labBookingRepository.save(newBooking);
    }
}
