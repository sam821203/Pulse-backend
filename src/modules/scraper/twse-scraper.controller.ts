import { Controller, Get } from '@nestjs/common';
import { TwseScraperService } from './twse-scraper.service';

@Controller('twse')
export class TwseScraperController {
  constructor(private readonly twseScraperService: TwseScraperService) {}

  @Get('equities')
  getEquitiesValues() {
    return this.twseScraperService.fetchEquitiesValues('2024-11-05');
  }
}
