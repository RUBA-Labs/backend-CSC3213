import { Test, TestingModule } from '@nestjs/testing';
import { LabBookingService } from './lab-booking.service';

describe('LabBookingService', () => {
  let service: LabBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabBookingService],
    }).compile();

    service = module.get<LabBookingService>(LabBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
