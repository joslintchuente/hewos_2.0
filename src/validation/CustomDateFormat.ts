import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCustomDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCustomDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const iso8601Pattern = new RegExp("^[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}$");
          return typeof value === 'string' && iso8601Pattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ISO 8601 date string`;
        },
      },
    });
  };
}