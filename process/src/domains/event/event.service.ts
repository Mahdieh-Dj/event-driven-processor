import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, Event } from '../../schemas/event.schema';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(payload: {
    agentId: string;
    type: string;
    value: number;
    timestamp: string;
  }) {
    const doc = await this.eventModel.create({
      agentId: payload.agentId,
      type: payload.type,
      value: payload.value,
      timestamp: new Date(payload.timestamp),
    });
    return doc;
  }
}
