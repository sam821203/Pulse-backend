import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TwseScraperService } from '../scraper/twse-scraper.service';
import { StockStaticRepository } from './stock-static.repository';
import { Cron } from '@nestjs/schedule';
import { IResponse } from 'src/interfaces/response.interface';
import { EMPTY } from 'rxjs';
// import { HttpService } from '@nestjs/axios';

@Injectable()
export class StockStaticService {
  private response: IResponse;

  constructor(
    private readonly twseScraperService: TwseScraperService,
    private readonly stockStaticRepository: StockStaticRepository,
  ) {}
  // private httpService: HttpService,

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

  // async fetchStockCapital() {
  //   const url = 'https://findbiz.nat.gov.tw/fts/query/QueryList/queryList.do';
  //   // https://findbiz.nat.gov.tw/fts/query/QueryCmpyDetail/queryCmpyDetail.do?objectId=SEMyMjA5OTkwNw==&banNo=22099907&disj=4516304CAF4E4D6F5966644EFFD6676B&fhl=zh_TW
  // }

  async findStockInfo(symbol?: string, name?: string): Promise<IResponse> {
    if (!symbol && !name) {
      throw new BadRequestException('須至少提供股票代號或股票名稱!');
    }

    let data;
    if (symbol) {
      data = await this.stockStaticRepository.findStockBySymbol(symbol);
      if (!data) {
        return {
          code: 2,
          msg: '股票代號錯誤',
          data: EMPTY,
        };
      }
    } else if (name) {
      data = await this.stockStaticRepository.findStockByName(name);
      if (!data || data.length === 0) {
        return {
          code: 2,
          msg: '股票名稱錯誤',
          data: EMPTY,
        };
      }
    } else {
      data = await this.stockStaticRepository.findAllStocks();
    }

    return {
      code: 0,
      msg: '查詢成功',
      data,
    };
  }
}
