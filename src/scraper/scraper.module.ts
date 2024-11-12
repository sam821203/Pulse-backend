import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwseScraperService } from './twse-scraper.service';
import { MopsScraperService } from './mops-scraper.service';

@Module({
  imports: [HttpModule],
  providers: [TwseScraperService, MopsScraperService],
})
export class ScraperModule {}
