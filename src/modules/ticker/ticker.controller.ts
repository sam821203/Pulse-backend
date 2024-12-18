import { Controller, Get, Param, Query } from '@nestjs/common';
import { TickerService } from '../../modules/ticker/ticker.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('ticker')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get(':date')
  @ApiOperation({ summary: '查詢全部個股資訊' })
  async getTickers(@Param('date') date: string) {
    return await this.tickerService.updateTickers(date);
  }

  @Get()
  @ApiQuery({
    name: 'symbol',
    required: false,
    description: '股票代號',
    schema: { default: '2330' },
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: '股票名稱',
    schema: { default: '台積電' },
  })
  @ApiOperation({ summary: '查詢個股資訊' })
  async findStock(
    @Query('symbol') symbol: string,
    @Query('name') name: string,
  ) {
    return await this.tickerService.findStockInfo(symbol, name);
  }
}
