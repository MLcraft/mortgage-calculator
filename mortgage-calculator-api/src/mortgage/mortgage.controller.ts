import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { MortgageService } from './mortgage.service';
import { MortgageParamDto } from './dtos/mortgage-params.dto';

@Controller('mortgage')
export class MortgageController {
    constructor(private readonly mortgageService: MortgageService) {}

    @Get('/ping')
    ping(): string {
        return this.mortgageService.ping();
    }

    @Post('/calculate')
    @HttpCode(200)
    calculate(@Body() body_params: MortgageParamDto) {
        console.log("Request params:")
        console.log(JSON.stringify(body_params))

        const mortgage_payment = this.mortgageService.calculateMortgagePayment(body_params.price, body_params.down_payment, body_params.interest_rate / 100, body_params.amortization_period, body_params.schedule);
    
        console.log("Response:")
        console.log({ payment: mortgage_payment })

        return { payment: mortgage_payment }
    }
}