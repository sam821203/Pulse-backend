import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DailyStockTradeDocument = HydratedDocument<DailyStockTrade>;

@Schema({ timestamps: true, versionKey: false })
export class DailyStockTrade {
  @Prop({ required: true })
  stockId: string;

  @Prop({ required: true })
  lastTradeDate: string; // YYYY-MM-DD

  @Prop({ required: true })
  lastTradeTime: string; // "09:30:00"

  @Prop({ required: true })
  openingPrice: string; // 開盤價

  @Prop({ required: true })
  highestPrice: string; // 最高價

  @Prop({ required: true })
  lowestPrice: string; // 最低價

  @Prop({ required: true })
  previousClose: string; // 昨收價

  @Prop()
  currentPrice: string; // 收盤價

  @Prop()
  currentVolume: string; // 當盤成交量

  // @Prop({ required: true })
  // sellVolume: string; // 揭示賣量 (配合「sellPrice」，以_分隔資料)

  // @Prop({ required: true })
  // marketType: string; // 上市別 (上市:tse，上櫃:otc，空白:已下市或下櫃)

  // @Prop({ required: true })
  // buyVolume: string; // 揭示買量 (配合「buyPrice」，以_分隔資料)

  // @Prop({ required: true })
  // buyPrice: string; // 揭示買價 (從高到低，以_分隔資料)

  // @Prop({ required: true })
  // stockCode: string; // 股票代號

  // @Prop({ required: true })
  // sellPrice: string; // 揭示賣價 (從低到高，以_分隔資料)

  // @Prop({ required: true })
  // companyShortName: string; // 公司簡稱

  // @Prop({ required: true })
  // downLimitPrice: string; // 跌停價

  // @Prop({ required: true })
  // accumulatedVolume: string; // 累積成交量

  // @Prop({ required: true })
  // upLimitPrice: string; // 漲停價

  // @Prop({ required: true })
  // companyName: string; // 公司全名

  // @Prop({ required: true })
  // previousClose: string; // 昨收

  // @Prop({ required: true })
  // issueShares: string; // 實收資本額
}

export const DailyStockTradeSchema =
  SchemaFactory.createForClass(DailyStockTrade);

export const DAILY_STOCK_TRADE_MODEL_TOKEN = DailyStockTrade.name;

export const DailyStockTradeDefinition: ModelDefinition = {
  name: DAILY_STOCK_TRADE_MODEL_TOKEN,
  schema: DailyStockTradeSchema,
};
