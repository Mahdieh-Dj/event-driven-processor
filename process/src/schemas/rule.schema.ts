import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Query } from 'mongoose';

export type RuleDocument = Rule & Document;

@Schema({ timestamps: true })
export class Rule {
  @Prop({ required: true })
  field!: string;

  @Prop({ required: true, enum: ['gt', 'lt', 'eq'] })
  operator!: 'gt' | 'lt' | 'eq';

  @Prop({ required: true })
  value!: number;

  @Prop({ default: false, required: false, select: false })
  isDeleted!: boolean;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);

RuleSchema.pre<Query<any, Rule>>(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

RuleSchema.pre<Query<any, Rule>>(/^count/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

RuleSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.isDeleted;
    return ret;
  },
});
