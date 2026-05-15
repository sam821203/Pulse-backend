import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class StockToday extends Document {
  @Prop({ required: true })
  stockId: string;

  @Prop({ required: true })
  tradeTime: string; // 交易時間，如 "09:30:00"

  @Prop({ required: true, type: Number })
  price: number; // 成交價格

  @Prop({ required: true, type: Number })
  volume: number; // 成交量
}

export const StockTodaySchema = SchemaFactory.createForClass(StockToday);
