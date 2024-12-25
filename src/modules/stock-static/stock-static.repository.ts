import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  STOCK_STATIC_MODEL_TOKEN,
  StockStaticDocument,
  StockStatic,
} from './schemas/stock-static.schema';

@Injectable()
export class StockStaticRepository {
  constructor(
    @InjectModel(STOCK_STATIC_MODEL_TOKEN)
    private readonly model: Model<StockStaticDocument>,
  ) {}

  async insertIndustryAndMarket(info: StockStatic[]) {
    await this.model.deleteMany({});
    return this.model.create(info);
  }

  async findStockBySymbol(symbol: string) {
    return this.model.find({ symbol });
  }

  async findStockByName(name: string) {
    return this.model.find({ name });
  }
}
