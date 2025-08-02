import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Root route controller
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
