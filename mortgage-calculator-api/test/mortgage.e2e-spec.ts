import * as request from 'supertest';
import 'reflect-metadata'
import { INestApplication } from "@nestjs/common";
import { ValidationPipe } from '@nestjs/common/pipes';
import { Test } from "@nestjs/testing";
import { MortgageModule } from "../src/mortgage/mortgage.module";
import { MortgageService } from "../src/mortgage/mortgage.service";

describe('Mortgage', () => {
    let app: INestApplication;
    const price = 200000
    const down_payment = 10000
    const annual_interest = 5
    const amortization_period = 25

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [MortgageModule],
        })
        .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe())
        await app.init();
    });

    it(`/GET ping`, () => {
        return request(app.getHttpServer())
          .get('/mortgage/ping')
          .expect(200)
          .expect( 'OK' );
      });

      it(`/POST calculate with valid params`, () => {
        return request(app.getHttpServer())
          .post('/mortgage/calculate')
          .send({ price: price, down_payment: down_payment, interest_rate: annual_interest, amortization_period: amortization_period, schedule: 'accelerated_biweekly' })
          .expect(200)
          .expect({
            payment: 555.36,
          });
      });
      
      it(`/POST calculate with invalid params`, () => {
        return request(app.getHttpServer())
          .post('/mortgage/calculate')
          .send({ price: -104, down_payment: 100, interest_rate: 67, amortization_period: 14, schedule: 'yearly' })
          .expect(400)
          .expect({
            statusCode: 400,
            message: [
              'price must be a positive number',
              'down_payment value does not meet minimum requirements for BC Mortgage Regulations as outlined by https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html',
              'interest_rate must not be greater than 60',
              'amortization_period must be one of the following values: 5, 10, 15, 20, 25, 30',
              'schedule must be one of the following values: accelerated_biweekly, biweekly, monthly'
            ],
            error: 'Bad Request'
          });
      });
});