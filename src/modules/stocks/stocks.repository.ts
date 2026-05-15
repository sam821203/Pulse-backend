import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DAILY_STOCK_TRADE_MODEL_TOKEN,
  DailyStockTradeDocument,
  DailyStockTrade,
} from './schemas/daily-stock-trade.schema';

@Injectable()
export class StocksRepository {
  constructor(
    @InjectModel(DAILY_STOCK_TRADE_MODEL_TOKEN)
    private readonly model: Model<DailyStockTradeDocument>,
  ) {}

  async insertStockData(info: DailyStockTrade[]) {
    // await this.model.deleteMany({});
    return this.model.create(info);
  }

  //   async findStockBySymbol(symbol: string) {
  //     return this.model.findOne({ symbol });
  //   }

  //   async findStockByName(name: string) {
  //     return this.model.findOne({ name });
  //   }

  async findStockRealTime(): Promise<DailyStockTrade[]> {
    return this.model.find();
  }
}
