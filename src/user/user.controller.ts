import { Controller, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('user')
@UseGuards(ThrottlerGuard)
export class UserController {}
