import {
  IsDate,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'isWithin24Hours', async: false })
export class IsWithin24Hours implements ValidatorConstraintInterface {
  validate(to: Date, args: ValidationArguments) {
    const obj = args.object as any;
    const from: Date = obj.from;
    if (!from || !to) return false;

    const diffMs = to.getTime() - from.getTime();
    return diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000; // <= 24h
  }

  defaultMessage(args: ValidationArguments) {
    return 'The difference between "from" and "to" must be less than 24 hours';
  }
}

export class GetRuleAgentTimestampsRequestDto {
  @IsDate()
  @Type(() => Date)
  from!: Date;

  @IsDate()
  @Type(() => Date)
  @Validate(IsWithin24Hours)
  to!: Date;
}
