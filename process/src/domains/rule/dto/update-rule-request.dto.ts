import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRuleRequestDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsIn(['gt', 'lt', 'eq'])
  operator?: 'gt' | 'lt' | 'eq';

  @IsOptional()
  @IsNumber()
  value?: number;
}
