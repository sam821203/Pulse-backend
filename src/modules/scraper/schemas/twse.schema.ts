import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TwseDocument = HydratedDocument<Twse>;

@Schema({ timestamps: true, versionKey: false })
export class Twse {
  @Prop()
  date: string;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  fiscalYearQuarter: string;

  @Prop()
  peRatio: number;

  @Prop()
  pbRatio: number;

  @Prop()
  dividendYield: number;

  @Prop()
  dividendYear: number;
}

export const TwseSchema = SchemaFactory.createForClass(Twse);

export const TWSE_MODEL_TOKEN = Twse.name;

export const TwseDefinition: ModelDefinition = {
  name: TWSE_MODEL_TOKEN,
  schema: TwseSchema,
};
