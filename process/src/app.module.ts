import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { AppService } from './app.service';
import { Rule, RuleSchema } from './schemas/rule.schema';
import { FinalEventSchema, FinalEvent } from './schemas/final-event.schema';
import { RuleModule } from './domains/rule/rule.module';
import { EventModule } from './domains/event/event.module';
import { FinalEventModule } from './domains/final-event/final-event.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/telemetry',
    ),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Rule.name, schema: RuleSchema },
      { name: FinalEvent.name, schema: FinalEventSchema },
    ]),
    RuleModule,
    EventModule,
    FinalEventModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
