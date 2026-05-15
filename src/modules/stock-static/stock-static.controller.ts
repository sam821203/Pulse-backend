import { Controller, Get, Query } from '@nestjs/common';
import { StockStaticService } from './stock-static.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('stock')
export class StockStaticController {
  constructor(private readonly stockStaticService: StockStaticService) {}
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
  async findStockInfo(
    @Query('symbol') symbol: string,
    @Query('name') name: string,
  ) {
    return await this.stockStaticService.findStockInfo(symbol, name);
  }
}
