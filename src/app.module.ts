/*
 * @description:
 * @param:
 * @return:
 */
import { Module } from '@nestjs/common';
// import { ScraperModule } from './scraper/scraper.module';
// import { MarketStatsModule } from './market-stats/market-stats.module';
// import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { Log4jsModule } from '@nestx-log4js/core';
import { AuthModule } from './auth/auth.module';

// const MONGO = {
//   phone: '<Example>',
//   password: encodeURIComponent('<YOUR_PASSWORD>'),
//   getUrl: function () {
//     return `mongodb+srv://${this.phone}:${this.password}@<YOUR_DB>`;
//   },
// };

@Module({
  imports: [
    // ConfigModule.forRoot(),
    // ScraperModule,
    // MarketStatsModule,
    // MongooseModule.forRoot(MONGO.getUrl()),
    Log4jsModule.forRoot(),
    DbModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
