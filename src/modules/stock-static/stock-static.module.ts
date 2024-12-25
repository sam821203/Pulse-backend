import { Module } from '@nestjs/common';
import { StockStaticService } from './stock-static.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StockStaticDefinition } from './schemas/stock-static.schema';
import { StockStaticController } from './stock-static.controller';
import { ScraperModule } from '../scraper/scraper.module';
import { StockStaticRepository } from './stock-static.repository';

@Module({
  imports: [MongooseModule.forFeature([StockStaticDefinition]), ScraperModule],
  providers: [StockStaticService, StockStaticRepository],
  controllers: [StockStaticController],
  exports: [StockStaticService],
})
export class StockStaticModule {}
