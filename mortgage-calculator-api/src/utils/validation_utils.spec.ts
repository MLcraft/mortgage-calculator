import { Validator } from 'class-validator';
import { IsValidDownPayment } from './validation_utils';


const validator = new Validator();

describe('ValidationUtils', () => {
  class TestClass {
    price: number    

    @IsValidDownPayment('price', { message: 'down_payment value invalid' })
    down_payment: number;

  }

  it('should be valid at minimum', () => {
    const obj = new TestClass();
    obj.price = 200000;
    obj.down_payment = 10000
    return validator.validate(obj).then(errors => {
      expect(errors.length).toBe(0);
    });
  });

  it('should be valid at maximum', () => {
    const obj = new TestClass();
    obj.price = 200000;
    obj.down_payment = 199999
    return validator.validate(obj).then(errors => {
      expect(errors.length).toBe(0);
    });
  });

  it('should be invalid - down payment too small for price < 500000', () => {
    const obj = new TestClass();
    obj.price = 200000;
    obj.down_payment = 5000
    return validator.validate(obj).then(errors => {
      expect(errors.length).toBe(1);
      expect(errors[0]["constraints"]["IsValidDownPayment"]).toBe("down_payment value invalid")
    });
  });

  it('should be invalid - down payment too small for price in between 500000 and 1000000', () => {
    const obj = new TestClass();
    obj.price = 800000;
    obj.down_payment = 40000
    return validator.validate(obj).then(errors => {
      expect(errors.length).toBe(1);
      expect(errors[0]["constraints"]["IsValidDownPayment"]).toBe("down_payment value invalid")
    });
  });

  it('should be invalid - down payment too small for price > 1000000', () => {
    const obj = new TestClass();
    obj.price = 8000000;
    obj.down_payment = 799999
    return validator.validate(obj).then(errors => {
      expect(errors.length).toBe(1);
      expect(errors[0]["constraints"]["IsValidDownPayment"]).toBe("down_payment value invalid")
    });
  });

  it('should be invalid - down payment larger than price', () => {
    const obj = new TestClass();
    obj.price = 200000;
    obj.down_payment = 500000
    return validator.validate(obj).then(errors => {
      expect(errors.length).toBe(1);
      expect(errors[0]["constraints"]["IsValidDownPayment"]).toBe("down_payment value invalid")
    });
  });
});