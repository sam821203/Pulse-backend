import { Module } from '@nestjs/common';
// import { MarketStatsModule } from './market-stats/market-stats.module';
// import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { Log4jsModule } from '@nestx-log4js/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ConfigModule.forRoot(),
    ScraperModule,
    // MarketStatsModule,
    Log4jsModule.forRoot(),
    DbModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
