import { Module } from '@nestjs/common';
import { EventProducerService } from './event-producer.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: +(process.env.REDIS_PORT || 6379),
      },
    }),
    BullModule.registerQueue({ name: 'events' }),
  ],
  controllers: [],
  providers: [EventProducerService],
})
export class EventProducerModule {}
