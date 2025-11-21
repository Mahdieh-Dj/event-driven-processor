import { Controller, Get, Param, Query } from '@nestjs/common';
import { FinalEventService } from './final-event.service';
import { RuleIdRequestDto } from '../rule/dto/rule-id-request.dto';
import { GetRuleAgentTimestampsRequestDto } from './dto/get-rule-agent-timestamps-request.dto';

@Controller()
export class FinalEventController {
  constructor(private readonly service: FinalEventService) {}

  @Get('rules/:id/agents/final-events/timestamps')
  async getAgentTimestampsForRule(
    @Param() { id: ruleId }: RuleIdRequestDto,
    @Query() payload: GetRuleAgentTimestampsRequestDto,
  ) {
    return this.service.getAgentTimestampsForRule({ ruleId, ...payload });
  }

  @Get('rules/:id/agents/final-events')
  async getAgentsCountByRule(@Param() { id: ruleId }: RuleIdRequestDto) {
    return this.service.getAgentsCountByRule(ruleId);
  }
}
