import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwseScraperService } from './twse-scraper.service';
import { MopsScraperService } from './mops-scraper.service';
import { TwseScraperController } from './twse-scraper.controller';

@Module({
  imports: [HttpModule],
  controllers: [TwseScraperController],
  providers: [TwseScraperService, MopsScraperService],
})
export class ScraperModule {}
