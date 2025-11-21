import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FinalEventDocument = FinalEvent & Document;

@Schema({ timestamps: true })
export class FinalEvent {
  @Prop({ required: true, index: true })
  ruleId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  eventId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  agentId!: string;

  @Prop({ required: true })
  timestamp!: Date;
}

export const FinalEventSchema = SchemaFactory.createForClass(FinalEvent);
FinalEventSchema.index({ agentId: 1, timestamp: -1 });
FinalEventSchema.index({ ruleId: 1, timestamp: -1 });
