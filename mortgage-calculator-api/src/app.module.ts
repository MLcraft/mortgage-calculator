import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MortgageController } from './mortgage/mortgage.controller';
import { MortgageService } from './mortgage/mortgage.service';
import { MortgageModule } from './mortgage/mortgage.module';

@Module({
  imports: [MortgageModule],
  controllers: [AppController, MortgageController],
  providers: [AppService, MortgageService],
})
export class AppModule {}
