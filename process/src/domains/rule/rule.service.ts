import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rule, RuleDocument } from '../../schemas/rule.schema';
import { CreateRuleRequestDto } from './dto/create-rule-request.dto';
import { findAllRulesRequestDto } from './dto/find-all-rules-request.dto';
import Redis from 'ioredis';
import {
  FinalEvent,
  FinalEventDocument,
} from '../../schemas/final-event.schema';

@Injectable()
export class RuleService {
  private redis: Redis;

  constructor(
    @InjectModel(Rule.name) private ruleModel: Model<RuleDocument>,
    @InjectModel(FinalEvent.name)
    private finalEventModel: Model<FinalEventDocument>,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: +process.env.REDIS_PORT!,
    });
  }

  async create(payload: CreateRuleRequestDto) {
    const created = await this.ruleModel.create(payload);

    return created;
  }

  async findAll(payload: findAllRulesRequestDto) {
    const { page, limit } = payload;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await this.ruleModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await this.ruleModel.countDocuments();

    return { total, items };
  }

  async findById(id: string) {
    return this.ruleModel.findById(id).lean();
  }

  async deleteOne(id: string) {
    await this.invalidateFieldCache(id);

    return this.ruleModel.findByIdAndUpdate(id);
  }

  async update(rule: RuleDocument) {
    await this.invalidateFieldCache(rule.field);

    return rule.save();
  }

  private cacheKeyForField(field: string) {
    return `rules:${field}`;
  }

  async getRulesForField(field: string): Promise<RuleDocument[]> {
    const key = this.cacheKeyForField(field);
    const cached = await this.redis.get(key);
    if (cached) {
      return JSON.parse(cached) as RuleDocument[];
    }
    const rules = await this.ruleModel.find({ field }).lean().exec();
    await this.redis.set(key, JSON.stringify(rules), 'EX', 60 * 60);

    return rules;
  }

  matchEventWithRules(event: any, rules: RuleDocument[]) {
    const matches: Array<{
      ruleId: Types.ObjectId;
      eventId: Types.ObjectId;
      agentId: string;
      timestamp: Date;
    }> = [];
    for (const rule of rules) {
      const val = event.value;
      const rv = rule.value;
      let ok = false;
      switch (rule.operator) {
        case 'gt':
          ok = val > rv;
          break;
        case 'lt':
          ok = val < rv;
          break;
        case 'eq':
          ok = val === rv;
          break;
      }
      if (ok) {
        matches.push({
          ruleId: rule._id,
          eventId: event._id,
          agentId: event.agentId,
          timestamp: event.timestamp,
        });
      }
    }
    return matches;
  }

  async persistMatches(
    matches: Array<{
      ruleId: any;
      eventId: any;
      agentId: string;
      timestamp: Date;
    }>,
  ) {
    if (matches.length === 0) return;

    await this.finalEventModel.insertMany(matches);
  }

  async invalidateFieldCache(field: string) {
    await this.redis.del(this.cacheKeyForField(field));
  }
}
