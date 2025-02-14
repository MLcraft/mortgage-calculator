import { Module } from '@nestjs/common';
import { MortgageController } from './mortgage.controller';
import { MortgageService } from './mortgage.service';

@Module({
    imports: [],
    controllers: [MortgageController],
    providers: [MortgageService],
})
export class MortgageModule {}
