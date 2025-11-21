import { IsIn, IsNumber, IsString } from 'class-validator';

export class CreateRuleRequestDto {
  @IsString()
  field!: string;

  @IsIn(['gt', 'lt', 'eq'])
  operator!: 'gt' | 'lt' | 'eq';

  @IsNumber()
  value!: number;
}
