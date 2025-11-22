import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { Role } from '../user/role.enum';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    creator: User,
  ): Promise<Announcement> {
    const { title, message, selectedViewer } = createAnnouncementDto;

    const fullCreator = await this.userService.findOne(creator.id);

    const announcement = this.announcementsRepository.create({
      title,
      message,
      selectedViewer,
      creator: fullCreator,
    });

    const savedAnnouncement = await this.announcementsRepository.save(announcement);

    const usersToNotify = await this.getUsersToNotify(selectedViewer);

    const senderDetails = `

--
Sent by:
Name: ${fullCreator.fullName}
Role: ${fullCreator.role}
Email: ${fullCreator.email}`;
    const notificationDescription = message + senderDetails;

    for (const user of usersToNotify) {
      const notificationDto: CreateNotificationDto = {
        userId: user.id,
        message: `New Announcement: ${title}`,
        description: notificationDescription,
      };
      await this.notificationService.createNotification(notificationDto);
    }

    return savedAnnouncement;
  }

  private async getUsersToNotify(selectedViewer: string): Promise<User[]> {
    const allUsers = await this.userService.findAll();
    if (selectedViewer === 'ALL') {
      return allUsers;
    } else {
      return allUsers.filter(user => user.role === selectedViewer);
    }
  }

  async findAllByCreator(creatorId: number): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      where: { creator: { id: creatorId } },
      relations: ['creator'],
    });
  }
}