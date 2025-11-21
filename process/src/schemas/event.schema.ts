import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, index: true })
  agentId!: string;

  @Prop({ required: true, index: true })
  type!: string;

  @Prop({ required: true })
  value!: number;

  @Prop({ required: true, index: true })
  timestamp!: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ agentId: 1, timestamp: -1 });
