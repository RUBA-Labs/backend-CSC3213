import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserService } from '../user/user.service';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        private readonly userService: UserService,
    ) {}

    async createNotification(
        createNotificationDto: CreateNotificationDto,
    ): Promise<{ id: string; message: string }> {
        const user = await this.userService.findOne(
            createNotificationDto.userId,
        );
        if (!user) {
            throw new NotFoundException(
                `User with ID ${createNotificationDto.userId} not found`,
            );
        }

        const notification = this.notificationRepository.create({
            ...createNotificationDto,
            user,
        });

        const savedNotification =
            await this.notificationRepository.save(notification);

        return {
            id: savedNotification.id,
            message: 'Notification created successfully',
        };
    }

    async findAllByUser(userId: number): Promise<NotificationDto[]> {
        return this.notificationRepository.find({
            where: { user: { id: userId } },
            select: ['id', 'message', 'createdAt', 'isRead'],
            order: { createdAt: 'DESC' },
            take: 20,
        });
    }

    async markAsRead(notificationId: string, userId: number): Promise<void> {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, user: { id: userId } },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        notification.isRead = true;
        await this.notificationRepository.save(notification);
    }

    async markAsUnread(notificationId: string, userId: number): Promise<void> {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, user: { id: userId } },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        notification.isRead = false;
        await this.notificationRepository.save(notification);
    }
}
