import { IsString } from 'class-validator';

export class RuleIdRequestDto {
  @IsString()
  id!: string;
}
