import { Module } from '@nestjs/common';
import { TickerRepository } from './ticker.repository';
import { TickerService } from './ticker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TickerDefinition } from './schemas/ticker.schema';
import { ScraperModule } from '../scraper/scraper.module';
import { TickerController } from './ticker.controller';

@Module({
  imports: [MongooseModule.forFeature([TickerDefinition]), ScraperModule],
  providers: [TickerService, TickerRepository],
  controllers: [TickerController],
  exports: [TickerService],
})
export class TickerModule {}
