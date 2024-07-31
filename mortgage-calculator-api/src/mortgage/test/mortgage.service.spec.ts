import { Test, TestingModule } from '@nestjs/testing';
import { MortgageService } from '../mortgage.service';

describe('MortgageService', () => {
  let service: MortgageService;
  const price = 200000
  const down_payment = 10000
  const annual_interest = 0.05
  const amortization_period = 25

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MortgageService],
    }).compile();

    service = module.get<MortgageService>(MortgageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('ping should work', () => {
    expect(service.ping()).toBe('OK')
  })
  
  it('calculatePerMonth should produce correct values', () => {

    const monthly_payment = service.calculatePerMonth(price, down_payment, annual_interest, amortization_period)
    const biweekly_payment = service.calculatePerMonth(153242, 30000, annual_interest, 20)
    const accelerated_biweekly_payment = service.calculatePerMonth(price, 16789, 0.035, amortization_period)

    expect(monthly_payment.toFixed(5)).toBe("1110.72108")
    expect(biweekly_payment.toFixed(5)).toBe("813.34265")
    expect(accelerated_biweekly_payment.toFixed(5)).toBe("917.19745")

  });

  it('bi-weekly payment schedule should produce correct values', () => {
    const perMonthMock = jest.spyOn(service, 'calculatePerMonth')
    perMonthMock.mockReturnValue(156)
    const biweekly_payment = service.calculateMortgagePayment(price, down_payment, annual_interest, amortization_period, 'biweekly')
    
    expect(biweekly_payment).toEqual(72)
    expect(perMonthMock).toHaveBeenCalledTimes(1)
    expect(perMonthMock).toHaveBeenCalledWith(price, down_payment, annual_interest, amortization_period)
  });

  it('accelerated bi-weekly payment schedule should produce correct values', () => {
    const perMonthMock = jest.spyOn(service, 'calculatePerMonth')
    perMonthMock.mockReturnValue(156)
    const accelerated_biweekly_payment = service.calculateMortgagePayment(price, down_payment, annual_interest, amortization_period, 'accelerated_biweekly')
    
    expect(accelerated_biweekly_payment).toEqual(78)
    expect(perMonthMock).toHaveBeenCalledTimes(1)
    expect(perMonthMock).toHaveBeenCalledWith(price, down_payment, annual_interest, amortization_period)
  });

  it('monthly payment schedule should produce correct values', () => {
    const perMonthMock = jest.spyOn(service, 'calculatePerMonth')
    perMonthMock.mockReturnValue(156)
    const monthly_payment = service.calculateMortgagePayment(price, down_payment, annual_interest, amortization_period, 'monthly')

    expect(monthly_payment).toEqual(156)
    expect(perMonthMock).toHaveBeenCalledTimes(1)
    expect(perMonthMock).toHaveBeenCalledWith(price, down_payment, annual_interest, amortization_period)
  });

  it('payment value should round to 2 decimal places', () => {
    const perMonthMock = jest.spyOn(service, 'calculatePerMonth')
    perMonthMock.mockReturnValue(156.12312455235)
    const round_down = service.calculateMortgagePayment(price, down_payment, annual_interest, amortization_period, 'monthly')

    expect(round_down).toEqual(156.12)
    expect(perMonthMock).toHaveBeenCalledTimes(1)
    expect(perMonthMock).toHaveBeenCalledWith(price, down_payment, annual_interest, amortization_period)

    perMonthMock.mockClear()

    perMonthMock.mockReturnValue(156.64532422)
    const round_up = service.calculateMortgagePayment(price, down_payment, annual_interest, amortization_period, 'monthly')

    expect(round_up).toEqual(156.65)
    expect(perMonthMock).toHaveBeenCalledTimes(1)
    expect(perMonthMock).toHaveBeenCalledWith(price, down_payment, annual_interest, amortization_period)
  });
});
