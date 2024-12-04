import { Module } from '@nestjs/common';
// import { MarketStatsModule } from './market-stats/market-stats.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configurationFactory from './config/configuration.factory';

@Module({
  imports: [
    ScraperModule,
    // MarketStatsModule,
    DbModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['development.env', 'production.env'],
      load: [configurationFactory],
      isGlobal: true,
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
