# BC Mortgage Payment Calculator API

Developed by Michelle Liu - `https://github.com/MLcraft`

Written in Typescript with NestJS and uses Jest as testing framework.

## Description

Endpoint for calculating mortgage payment per interval from provided parameters. Mortgage is calculated assuming interest is compounded monthly.

**File structure:**

- Main calculation logic is found in `src/mortgage/mortgage.service.ts`
- Controller for API endpoint is found in `src/mortgage/mortgage.controller.ts`
- Data structures are in `src/mortgage/dtos`
- Extra utils for input validation are present in `src/utils/validation_utils.ts`
- Unit tests can be found in `src/mortgage/test`. E2E tests are in `test` folder in root directory
## Installation

```bash
$ npm install
```

## Running the app

The app will run on port `5000` by default.
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Usage

`GET /ping` - pings the server to check for health

`GET /mortgage/ping` - pings mortgage specific endpoint to check for health

`POST /mortgage/calculate` - send request to calculate mortgage payment with the parameters specified in the request body. Returns `400 Bad Request` with error details if request body is invalid.

Sample request:
```json
{
    "price": 200000,
    "down_payment": 10000,
    "interest_rate": 5,
    "amortization_period": 25,
    "schedule": "accelerated monthly"
}
```
Request parameters (all required):
- `price` - Price of the purchased property. Must be a positive integer.
- `down_payment` - Down payment for mortgage. Must be a positive integer and must meet minimum requirements per the regulations as outlined [here](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html)
- `interest_rate` - Annual interest rate for the loan. Must be greater than 0 and less than 60 (see: laws regarding maximum legal interest rates [here](https://www.canada.ca/en/department-finance/programs/consultations/2022/fighting-predatory-lending/consultation-criminal-rate-interest.html#_Toc88652475))
- `amortization_period` - Amortization period of the mortgage. Must be a multiple of 5 in between 5 and 30
- `schedule` - Payment schedule for the mortgage. Must be one of: `monthly`, `biweekly`, `accelerated_biweekly`

Sample Responses:

Success:
`200 OK`
```json
{
    "payment": 555.36
}
```
Error: `400 Bad Request`
```json
{
    "statusCode": 400,
    "message": [
        "interest_rate must not be greater than 60",
        "interest_rate must not be less than 0",
        "interest_rate must be a positive number",
        "interest_rate must be a number conforming to the specified constraints",
        "amortization_period must be one of the following values: 5, 10, 15, 20, 25, 30",
        "schedule must be one of the following values: accelerated_biweekly, biweekly, monthly"
    ],
    "error": "Bad Request"
}
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

