import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TwseScraperService } from './twse-scraper.service';
// import { MopsScraperService } from './mops-scraper.service';
import { TwseScraperController } from './twse-scraper.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TwseDefinition } from './schemas/twse.schema';

@Module({
  imports: [MongooseModule.forFeature([TwseDefinition]), HttpModule],
  controllers: [TwseScraperController],
  providers: [TwseScraperService],
  exports: [TwseScraperService],
})
export class ScraperModule {}
