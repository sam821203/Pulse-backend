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
      // this.updateStockMarket()
    ]).then(() => delay(1000));
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
      const tickers = data.map((ticker: any) => ({
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

  // 查詢 31 天前的該股資訊
  async findStockInfo(date: string, symbol?: string, name?: string) {
    if (!symbol && !name) {
      throw new BadRequestException('須至少提供股票代號或股票名稱!');
    }

    const queryDate = date
      ? DateTime.fromISO(date).minus({ days: 1 }).toISODate()
      : null;

    if (symbol) {
      return await this.tickerRepository.findStockBySymbolAndDate(
        symbol,
        queryDate,
      );
    } else if (name) {
      return await this.tickerRepository.findStockByNameAndDate(
        name,
        queryDate,
      );
    }
  }

  // 每年 1 月 1 日的午夜（00:00）執行一次
  // @Cron('0 0 0 1 1 *')
  // async updateStockMarket() {
  //   try {
  //     const [tse, otc] = await Promise.all([
  //       this.twseScraperService.fetchListedStocks({ market: 'TSE' }),
  //       this.twseScraperService.fetchListedStocks({ market: 'OTC' }),
  //     ]);

  //     const tickers = [...tse, ...otc];

  //     // await Promise.all(
  //     //   tickers.map((ticker) =>
  //     //     this.tickerRepository.updateIndustryAndMarket(ticker),
  //     //   ),
  //     // );

  //     Logger.log(`產業已更新`);
  //   } catch (error) {
  //     Logger.warn(`產業無法更新`);
  //     console.error('Failed to fetch market stocks:', error);
  //     throw new Error('Failed to fetch market stocks');
  //   }
  // }

  // async findFirstStock(symbol: string) {
  //   return await this.tickerRepository.findFirstStockBySymbol(symbol);
  // }
}
