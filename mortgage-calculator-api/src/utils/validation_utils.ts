import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

// Custom validator decorator for use with class-validator library 
export function IsValidDownPayment(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDownPayment',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [price] = args.constraints;
          const purchase_price = (args.object as any)[price];
          // guards because validators are all run regardless of the result of other validators, therefore cannot ensure that the values will be positive integers
          if (typeof value === 'number' && typeof purchase_price === 'number') {
            // Valid down payment regulations taken from: https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html
            if (value > 0 && purchase_price > 0 && value < purchase_price) {
                if (purchase_price < 500000) {
                    return value >= purchase_price * 0.05
                } else if (purchase_price < 1000000) {
                    return value >= ((500000 * 0.05) + ((1000000 - purchase_price)) * 0.1)
                } else {
                    return value >= purchase_price * 0.2
                }
            } else {
                return false
            }
          } else {
            return false
          }
        },
      },
    });
  };
}