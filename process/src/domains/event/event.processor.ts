import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RuleService } from '../rule/rule.service';
import { EventService } from './event.service';

@Processor('events')
export class EventsProcessor extends WorkerHost {
  constructor(
    private readonly eventService: EventService,
    private readonly ruleService: RuleService,
  ) {
    super();
  }

  async process(job: Job) {
    console.log('in process');
    const event = job.data as {
      agentId: string;
      type: string;
      value: number;
      timestamp: string;
    };
    const saved = await this.eventService.create(event);

    const rules = await this.ruleService.getRulesForField(event.type);

    const matches = this.ruleService.matchEventWithRules(saved, rules);

    await this.ruleService.persistMatches(matches);
  }
}
