import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockStaticDocument = HydratedDocument<StockStatic>;

@Schema({ timestamps: true, versionKey: false })
export class StockStatic {
  // 指數或股票代號
  @Prop()
  symbol: string;

  // 指數或股票名稱
  @Prop()
  name: string;

  // 上市別
  @Prop()
  market: string;

  // 產業別
  @Prop()
  industry: string;
}

export const StockStaticSchema = SchemaFactory.createForClass(StockStatic);

export const STOCK_STATIC_MODEL_TOKEN = StockStatic.name;

export const StockStaticDefinition: ModelDefinition = {
  name: STOCK_STATIC_MODEL_TOKEN,
  schema: StockStaticSchema,
};
