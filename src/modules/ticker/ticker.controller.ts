import { Controller, Get, Param } from '@nestjs/common';
import { TickerService } from '../../modules/ticker/ticker.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get(':date')
  @ApiOperation({ summary: '查詢個股資訊' })
  async getTickers(@Param('date') date: string) {
    return await this.tickerService.updateTickers(date);
  }

  // TODO: GET 從資料庫中取得特定日期的股票資訊 {find: ...}
  // TODO: find symbol / name 來查個股股票資訊
}
