import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventProducerModule } from './event-producer/event-producer.module';

@Module({
  imports: [EventProducerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
