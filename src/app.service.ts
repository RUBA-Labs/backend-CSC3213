import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Simple method returning a welcome string
  getHello(): string {
    return 'Hello World!';
  }
}
