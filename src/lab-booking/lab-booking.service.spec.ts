import { Test, TestingModule } from '@nestjs/testing';
import { LabBookingService } from './lab-booking.service';

describe('LabBookingService', () => {
  let service: LabBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabBookingService,
        {
          provide: 'LabBookingRepository', // Use the string token for custom repositories
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: 'LabSessionRepository',
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: 'ComputerRepository',
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LabBookingService>(LabBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
