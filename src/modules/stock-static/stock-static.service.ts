import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TwseScraperService } from '../scraper/twse-scraper.service';
import { StockStaticRepository } from './stock-static.repository';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StockStaticService {
  constructor(
    private readonly twseScraperService: TwseScraperService,
    private readonly stockStaticRepository: StockStaticRepository,
  ) {}

  // 每年 1 月 1 日的午夜（00:00）執行一次
  @Cron('0 0 0 1 1 *')
  async insertStockStatic() {
    try {
      const [tse, otc] = await Promise.all([
        this.twseScraperService.fetchListedStocks({ market: 'TSE' }),
        this.twseScraperService.fetchListedStocks({ market: 'OTC' }),
      ]);

      const result = [...tse, ...otc];

      this.stockStaticRepository.insertIndustryAndMarket(result);

      Logger.log(`產業已更新`);
    } catch (error) {
      Logger.warn(`產業無法更新`);
      console.error('Failed to fetch market stocks:', error);
      throw new Error('Failed to fetch market stocks');
    }
  }

  async findStockInfo(symbol?: string, name?: string) {
    if (!symbol && !name) {
      return new BadRequestException('須至少提供股票代號或股票名稱!');
    } else {
      if (symbol) {
        return await this.stockStaticRepository.findStockBySymbol(symbol);
      } else if (name) {
        return await this.stockStaticRepository.findStockByName(name);
      }
    }
  }
}
