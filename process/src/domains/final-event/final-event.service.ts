import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { FinalEvent } from '../../schemas/final-event.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FinalEventService {
  constructor(
    @InjectModel(FinalEvent.name) private finalEventModel: Model<FinalEvent>,
  ) {}

  async getAgentTimestampsForRule(payload: {
    ruleId: string;
    from: Date;
    to: Date;
  }) {
    const { ruleId, from, to } = payload;
    const match: any = {
      ruleId: new Types.ObjectId(ruleId),
    };

    const result = await this.finalEventModel
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: '$agentId',
            timestamps: { $push: '$timestamp' },
          },
        },
        {
          $project: {
            agentId: '$_id',
            _id: 0,
            timestamps: 1,
          },
        },
      ])
      .exec();

    return result;
  }

  async getAgentsCountByRule(ruleId: string): Promise<any[]> {
    const result = await this.finalEventModel
      .aggregate([
        { $match: { ruleId: new Types.ObjectId(ruleId) } },
        {
          $group: {
            _id: '$agentId',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            agentId: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ])
      .exec();

    return result;
  }
}
