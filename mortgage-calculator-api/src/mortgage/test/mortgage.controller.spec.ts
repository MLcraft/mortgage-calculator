import { Test, TestingModule } from '@nestjs/testing';
import { MortgageController } from '../mortgage.controller';
import { MortgageService } from '../mortgage.service';
import { PAYMENT_SCHEDULE } from '../dtos/mortgage-params.dto';

describe('MortgageController', () => {
  let controller: MortgageController;
  const price = 200000
  const down_payment = 10000
  const annual_interest = 0.05
  const amortization_period = 25

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MortgageService],
      controllers: [MortgageController],
    }).compile();

    controller = module.get<MortgageController>(MortgageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('ping should work', () => {
    expect(controller.ping()).toBe('OK');
  });

  it('calculate should work', () => {
    expect(controller.calculate({ price: price, down_payment: down_payment, interest_rate: annual_interest, amortization_period: amortization_period, schedule: PAYMENT_SCHEDULE.ACCELERATED_BI_WEEKLY })).toStrictEqual({"payment": 318.66});
  });
});
