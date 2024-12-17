import { Controller, Get, Param } from '@nestjs/common';
// import { TwseScraperService } from '../../modules/scraper/twse-scraper.service';
import { TickerService } from '../../modules/ticker/ticker.service';

// @Controller('copy-todos')
@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  // TODO: 更新每日行情數據到資料庫
  @Get(':date')
  async getTickers(@Param('date') date: string) {
    return await this.tickerService.updateTickers(date);
  }
}
