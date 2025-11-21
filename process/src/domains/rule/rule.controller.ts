import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleIdRequestDto } from './dto/rule-id-request.dto';
import { UpdateRuleRequestDto } from './dto/update-rule-request.dto';
import { CreateRuleRequestDto } from './dto/create-rule-request.dto';
import { findAllRulesRequestDto } from './dto/find-all-rules-request.dto';

@Controller('rules')
export class RuleController {
  constructor(private readonly service: RuleService) {}

  @Post()
  async create(@Body() dto: CreateRuleRequestDto) {
    return await this.service.create(dto);
  }

  @Get()
  async findAll(@Query() payload: findAllRulesRequestDto) {
    return this.service.findAll(payload);
  }

  @Get(':id')
  async findOne(@Param() { id }: RuleIdRequestDto) {
    const rule = await this.service.findById(id);
    if (!rule) throw new NotFoundException('Rule not found');

    return rule;
  }

  @Delete(':id')
  async delete(@Param() { id }: RuleIdRequestDto) {
    const rule = await this.service.findById(id);
    if (!rule) throw new NotFoundException('Rule not found');

    await this.service.deleteOne(id);

    return { message: 'Deleted' };
  }

  @Patch(':id')
  async update(
    @Param() { id }: RuleIdRequestDto,
    @Body() payload: UpdateRuleRequestDto,
  ) {
    const rule = await this.service.findById(id);
    if (!rule) throw new NotFoundException('Rule not found');

    rule.field = payload.field ?? rule.field;
    rule.operator = payload.operator ?? rule.operator;
    rule.value = payload.value ?? rule.value;

    await this.service.update(rule);

    return rule;
  }
}
