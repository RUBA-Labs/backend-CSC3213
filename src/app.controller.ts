import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller() // Root route controller
@UseGuards(ThrottlerGuard)
export class AppController {
    // Inject AppService via constructor
    constructor(private readonly appService: AppService) {}

    // Handle GET requests at root "/"
    @Throttle({
        short: { limit: 3, ttl: 1000 },
        long: { limit: 20, ttl: 60000 },
    })
    @Get()
    getHello(): string {
        // Return the message from the service
        return this.appService.getHello();
    }
}
