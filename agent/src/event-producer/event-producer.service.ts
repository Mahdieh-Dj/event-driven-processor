import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
const { faker } = require('@faker-js/faker');

@Injectable()
export class EventProducerService implements OnModuleInit {
  constructor(@InjectQueue('events') private readonly eventQueue: Queue) {}

  onModuleInit() {
    setInterval(() => this.produceOne(), 200);
  }

  async produceOne() {
    const types = ['temperature', 'pressure', 'speed', 'voltage', 'noise'];
    const event = {
      agentId: process.env.AGENT_ID || `agent-${faker.string.uuid()}`,
      type: types[Math.floor(Math.random() * types.length)],
      value: parseFloat((Math.random() * 100).toFixed(2)),
      timestamp: new Date().toISOString(),
    };
    await this.eventQueue.add('new_event', event, {
      removeOnComplete: true,
      attempts: 3,
    });
  }
}
