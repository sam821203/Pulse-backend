import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { StocksRepository } from './stocks.repository';
import { DailyStockTradeDefinition } from './schemas/daily-stock-trade.schema';

@Module({
  imports: [MongooseModule.forFeature([DailyStockTradeDefinition])],
  providers: [StocksService, StocksRepository],
  controllers: [StocksController],
  exports: [StocksService],
})
export class StocksModule {}
