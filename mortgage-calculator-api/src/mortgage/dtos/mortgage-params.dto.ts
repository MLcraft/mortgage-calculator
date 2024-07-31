import { IsEnum, IsInt, IsNumber, IsPositive, Max, Min } from "class-validator";
import { IsValidDownPayment } from "../../utils/validation_utils";

// Enum representing valid payment schedule values
export enum PAYMENT_SCHEDULE {
    ACCELERATED_BI_WEEKLY = "accelerated_biweekly",
    BI_WEEKLY = "biweekly",
    MONTHLY = "monthly"
}

// Enum representing valid amortization period values
export enum AMORTIZATION_PERIOD {
    FIVE = 5,
    TEN = 10,
    FIFTEEN = 15,
    TWENTY = 20,
    TWENTY_FIVE = 25,
    THIRTY = 30
}

// Dto for calculation input parameters format
export class MortgageParamDto {
    @IsInt()
    @IsPositive()
    public price: number;

    @IsInt()
    @IsPositive()
    @IsValidDownPayment('price', { message: 'down_payment value does not meet minimum requirements for BC Mortgage Regulations as outlined by https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html' })
    public down_payment: number;

    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(60) // Interest rate > 60 is a criminal offence: https://www.canada.ca/en/department-finance/programs/consultations/2022/fighting-predatory-lending/consultation-criminal-rate-interest.html#_Toc88652475
    public interest_rate: number;

    @IsEnum(AMORTIZATION_PERIOD)
    public amortization_period: AMORTIZATION_PERIOD

    @IsEnum(PAYMENT_SCHEDULE)
    public schedule: PAYMENT_SCHEDULE
}