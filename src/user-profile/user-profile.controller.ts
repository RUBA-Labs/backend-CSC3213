import {
    Controller,
    Patch,
    Body,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';

@ApiTags('User Profile')
@ApiBearerAuth()
@Controller('user-profile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) {}

    @Patch()
    @ApiOperation({ summary: "Update logged-in user's profile" })
    @ApiResponse({
        status: 200,
        description: 'User profile successfully updated.',
    })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiBody({
        type: UpdateUserProfileDto,
        examples: {
            updateFullName: {
                summary: 'Update full name example',
                value: {
                    fullName: 'Jane Doe',
                },
            },
            updateDepartment: {
                summary: 'Update department example',
                value: {
                    department: 'Electrical Engineering',
                },
            },
            updatePhone: {
                summary: 'Update phone number example',
                value: {
                    phone: '999-888-7777',
                },
            },
            updateMultipleFields: {
                summary: 'Update multiple fields example',
                value: {
                    fullName: 'Jane A. Doe',
                    department: 'Computer Engineering',
                    phone: '111-222-3333',
                },
            },
        },
    })
    async updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() updateUserProfileDto: UpdateUserProfileDto,
    ) {
        const userId = req.user.userId;
        return this.userProfileService.updateProfile(userId, updateUserProfileDto);
    }
}

