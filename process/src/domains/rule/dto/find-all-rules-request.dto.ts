import { IsNumberString } from 'class-validator';

export class findAllRulesRequestDto {
  @IsNumberString()
  page!: string;

  @IsNumberString()
  limit!: string;
}
