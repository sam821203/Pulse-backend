import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TickerType } from './enums/index';
import { TickerRepository } from './ticker.repository';
import { TwseScraperService } from '../scraper/twse-scraper.service';
import { TpexScraperService } from '../scraper/tpex-scraper.service';
import { DateTime } from 'luxon';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TickerService {
  constructor(
    private readonly tickerRepository: TickerRepository,
    private readonly twseScraperService: TwseScraperService,
    private readonly tpexScraperService: TpexScraperService,
  ) {}

  async updateTickers(date: string = DateTime.local().toISODate()) {
    // 每五秒抓取前日股票資訊
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await Promise.all([
      this.updateTwseEquitiesValues(date),
      this.updateTpexEquitiesValues(date),
    ]).then(() => delay(2000));
  }

  @Cron('0 0 17 * * *')
  async updateTwseEquitiesValues(date: string = DateTime.local().toISODate()) {
    const data = await this.twseScraperService.fetchEquitiesValues(date);
    if (data) {
      const tickers = data.map((ticker) => ({
        date: ticker.date,
        type: TickerType.Index,
        symbol: ticker.symbol,
        name: ticker.name.trim(),
        fiscalYearQuarter: ticker.fiscalYearQuarter,
        peRatio: ticker.peRatio,
        pbRatio: ticker.pbRatio,
        dividendYield: ticker.dividendYield,
        dividendYear: ticker.dividendYear,
      }));

      await Promise.all(
        tickers.map((ticker) => this.tickerRepository.updateTicker(ticker)),
      );

      Logger.log(`${date} 上市本益比: 已更新`, TickerService.name);
    } else {
      Logger.warn(`${date} 上市本益比: 尚無資料或非交易日`, TickerService.name);
    }
  }

  @Cron('0 0 17 * * *')
  async updateTpexEquitiesValues(date: string = DateTime.local().toISODate()) {
    const data = await this.tpexScraperService.fetchEquitiesValues(date);
    if (data) {
      const tickers = data.map((ticker) => ({
        date: ticker.date,
        type: TickerType.Index,
        symbol: ticker.symbol,
        name: ticker.name.trim(),
        dividendPerShare: ticker.dividendPerShare,
        peRatio: ticker.peRatio,
        pbRatio: ticker.pbRatio,
        dividendYield: ticker.dividendYield,
        dividendYear: ticker.dividendYear,
      }));

      await Promise.all(
        tickers.map((ticker) => this.tickerRepository.updateTicker(ticker)),
      );

      Logger.log(`${date} 上櫃本益比: 已更新`, TickerService.name);
    } else {
      Logger.warn(`${date} 上櫃本益比: 尚無資料或非交易日`, TickerService.name);
    }
  }

  async findStockInfo(symbol?: string, name?: string) {
    if (!symbol && !name) {
      return new BadRequestException('須至少提供股票代號或股票名稱!');
    } else {
      if (symbol) {
        return await this.tickerRepository.findStockBySymbol(symbol);
      } else if (name) {
        return await this.tickerRepository.findStockByName(name);
      }
    }
  }
}
