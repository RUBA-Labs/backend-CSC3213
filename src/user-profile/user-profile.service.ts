import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UserProfileService {
    constructor(private readonly userService: UserService) {}

    async updateProfile(
        userId: number,
        updateUserProfileDto: UpdateUserProfileDto,
    ) {
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

    async changePassword(
        userId: number,
        changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.oldPassword,
            user.password,
        );
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid old password');
        }

        // Pass the plain new password to userService.update, which will handle hashing
        await this.userService.update(userId, {
            password: changePasswordDto.newPassword,
        });
    }

    async getUserDetails(userId: number): Promise<{
        email: string;
        fullName?: string;
        department?: string;
        phone?: string;
    }> {
        const user = await this.userService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return {
            email: user.email,
            fullName: user.fullName,
            department: user.department,
            phone: user.phone,
        };
    }
}
