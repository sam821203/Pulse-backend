import { Injectable, Logger } from '@nestjs/common';
import { TickerType } from './enums/index';
import { TickerRepository } from './ticker.repository';
import { TwseScraperService } from '../scraper/twse-scraper.service';
import { DateTime } from 'luxon';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TICKER_MODEL_TOKEN, TickerDocument } from './schemas/ticker.schema';

@Injectable()
export class TickerService {
  constructor(
    private readonly tickerRepository: TickerRepository,
    private readonly twseScraperService: TwseScraperService,
    @InjectModel(TICKER_MODEL_TOKEN) private tickerModel: Model<TickerDocument>,
  ) {}

  async updateTickers(date: string = DateTime.local().toISODate()) {
    // const delay = (ms: number) =>
    //   new Promise((resolve) => setTimeout(resolve, ms));

    // await Promise.all([this.updateTwseEquitiesValues(date)]).then(() =>
    //   delay(5000),
    // );
    await this.updateTwseEquitiesValues(date);

    Logger.log(`${date} 已完成`, TickerService.name);
  }

  @Cron('0 0 17 * * *')
  async updateTwseEquitiesValues(date: string = DateTime.local().toISODate()) {
    const data = await this.twseScraperService.fetchEquitiesValues(date);
    if (data) {
      const tickers = data.map((ticker) => ({
        date: ticker.date,
        type: TickerType.Index,
        symbol: ticker.symbol,
        name: ticker.name,
        peRatio: ticker.peRatio,
        pbRatio: ticker.pbRatio,
        dividendYield: ticker.dividendYield,
        dividendYear: ticker.dividendYear,
      }));

      await Promise.all(
        tickers.map((ticker) => this.tickerRepository.updateTicker(ticker)),
      );

      Logger.log(`${date} 本益比: 已更新`, TickerService.name);
    } else {
      Logger.warn(`${date} 本益比: 尚無資料或非交易日`, TickerService.name);
    }
  }
}
