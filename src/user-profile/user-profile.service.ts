import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class UserProfileService {
    constructor(private readonly userService: UserService) {}

    async updateProfile(userId: number, updateUserProfileDto: UpdateUserProfileDto) {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // Update only allowed fields
        if (updateUserProfileDto.fullName !== undefined) {
            user.fullName = updateUserProfileDto.fullName;
        }
        if (updateUserProfileDto.department !== undefined) {
            user.department = updateUserProfileDto.department;
        }
        if (updateUserProfileDto.phone !== undefined) {
            user.phone = updateUserProfileDto.phone;
        }

        return this.userService.update(userId, user);
    }
}
