import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':stockId/history')
  async getStockHistory(@Param('stockId') stockId: string) {
    return this.stocksService.getStockHistory(stockId);
  }
}
