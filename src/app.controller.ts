import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller() // Root route controller
@UseGuards(ThrottlerGuard)
export class AppController {
    // Inject AppService via constructor
    constructor(private readonly appService: AppService) {}

    // Handle GET requests at root "/"
    @Get()
    getHello(): string {
        // Return the message from the service
        return this.appService.getHello();
    }
}
