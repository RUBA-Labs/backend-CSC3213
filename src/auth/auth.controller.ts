import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'User successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async login(@Body() loginDto: LoginDto, @Req() req: Request) {
        const ipAddress = req.ip || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        return this.authService.login(loginDto, ipAddress, userAgent);
    }
}
