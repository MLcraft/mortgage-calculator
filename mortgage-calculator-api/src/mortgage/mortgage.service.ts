import { Injectable } from '@nestjs/common';
import { PAYMENT_SCHEDULE } from './dtos/mortgage-params.dto';

@Injectable()
export class MortgageService {
    ping(): string {
        return 'OK';
    }

    // Monthly payment calculation helper. Uses formula provided in the spec file.
    calculatePerMonth(price, down_payment, annual_interest, amortization_period) {
        const principle = price - down_payment
        const per_payment_interest = annual_interest / 12
        const number_of_payments = amortization_period * 12

        let payment = principle * ((per_payment_interest * ((1 + per_payment_interest) ** number_of_payments)) / (((1 + per_payment_interest) ** number_of_payments) - 1))

        return payment
    }

    // Final payment calculation is done by finding the monthly payment (m) using the formula specified in the spec (helper method above)
    // Then adjusting for bi-weekly (m * 12 / 26) or accelerated bi-weekly (m / 2) payment schedules accordingly based on the instructions in the site below
    // Source: https://www.ratehub.ca/determining-your-payment
    calculateMortgagePayment(price, down_payment, annual_interest, amortization_period, payment_schedule) {
        let payment = this.calculatePerMonth(price, down_payment, annual_interest, amortization_period)

        if (payment_schedule == PAYMENT_SCHEDULE.ACCELERATED_BI_WEEKLY) {
            payment = payment / 2
        } else if (payment_schedule == PAYMENT_SCHEDULE.BI_WEEKLY) {
            payment = payment * 12 / 26
        }
        return +payment.toFixed(2)
    }
}
