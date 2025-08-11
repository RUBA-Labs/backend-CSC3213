import { Test, TestingModule } from '@nestjs/testing';
import { LabBookingController } from './lab-booking.controller';

describe('LabBookingController', () => {
  let controller: LabBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabBookingController],
    }).compile();

    controller = module.get<LabBookingController>(LabBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
