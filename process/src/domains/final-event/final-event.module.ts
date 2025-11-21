import { Module } from '@nestjs/common';
import { FinalEventController } from './final-event.controller';
import { FinalEventService } from './final-event.service';

@Module({
  imports: [],
  providers: [FinalEventService],
  controllers: [FinalEventController],
})
export class FinalEventModule {}
