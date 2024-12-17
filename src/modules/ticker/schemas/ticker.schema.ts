import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TickerDocument = HydratedDocument<Ticker>;

@Schema({ timestamps: true, versionKey: false })
export class Ticker {
  // 期
  @Prop({ required: true })
  date: string;

  // 類型
  // @Prop()
  // type: string;

  // 所屬交易所
  // @Prop()
  // exchange: string;

  // // 所屬市場別
  // @Prop()
  // market: string;

  // 指數或股票代號
  @Prop()
  symbol: string;

  // 指數或股票名稱
  @Prop()
  name: string;

  // 開盤價
  // @Prop()
  // openPrice: number;

  // // 最高價
  // @Prop()
  // highPrice: number;

  // // 最低價
  // @Prop()
  // lowPrice: number;

  // // 收盤價
  // @Prop()
  // closePrice: number;

  // // 漲跌
  // @Prop()
  // change: number;

  // // 漲跌幅
  // @Prop()
  // changePercent: number;

  // // 成交量
  // @Prop()
  // tradeVolume: number;

  // // 成交金額
  // @Prop()
  // tradeValue: number;

  // // 成交筆數
  // @Prop()
  // transaction: number;

  // // 成交比重
  // @Prop()
  // tradeWeight: number;

  // // 外資買賣超
  // @Prop()
  // finiNetBuySell: number;

  // // 投信買賣超
  // @Prop()
  // sitcNetBuySell: number;

  // // 自營商買賣超
  // @Prop()
  // dealersNetBuySell: number;

  // 每股股利
  @Prop()
  dividendPerShare: number;

  // 財報年/季
  @Prop()
  fiscalYearQuarter: string;

  // 本益比
  @Prop()
  peRatio: number;

  // 股價淨值比
  @Prop()
  pbRatio: number;

  // 殖利率
  @Prop()
  dividendYield: number;

  // 股利年度
  @Prop()
  dividendYear: number;
}

export const TickerSchema = SchemaFactory.createForClass(Ticker).index(
  { date: -1, symbol: 1 },
  { unique: true },
);

export const TICKER_MODEL_TOKEN = Ticker.name;

export const TickerDefinition: ModelDefinition = {
  name: TICKER_MODEL_TOKEN,
  schema: TickerSchema,
};
