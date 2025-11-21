import { Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { EventsProcessor } from './event.processor';
import { EventService } from './event.service';
import { RuleService } from '../rule/rule.service';

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: +(process.env.REDIS_PORT || 6379),
};

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'EVENTS_QUEUE',
      useFactory: () => {
        const connection = new IORedis(redisConnection);
        const queueName = process.env.QUEUE_NAME || 'events';
        return new Queue(queueName, { connection });
      },
    },
    EventsProcessor,
    EventService,
    RuleService,
  ],
})
export class EventModule {}
