import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TICKER_MODEL_TOKEN,
  TickerDocument,
  Ticker,
} from './schemas/ticker.schema';

@Injectable()
export class TickerRepository {
  constructor(
    @InjectModel(TICKER_MODEL_TOKEN)
    private readonly model: Model<TickerDocument>,
  ) {}

  async updateTicker(ticker: Partial<Ticker>) {
    const { date, symbol } = ticker;
    return this.model.updateOne({ date, symbol }, ticker, { upsert: true });
  }
}
