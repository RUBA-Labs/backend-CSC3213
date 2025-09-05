import { Test, TestingModule } from '@nestjs/testing';
import { LabBookingController } from './lab-booking.controller';
import { LabBookingService } from './lab-booking.service';

describe('LabBookingController', () => {
    let controller: LabBookingController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LabBookingController],
            providers: [
                {
                    provide: LabBookingService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<LabBookingController>(LabBookingController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
