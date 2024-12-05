import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
// import { MarketStatsModule } from './market-stats/market-stats.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configurationFactory from './config/configuration.factory';
import jwtConfigFactory from './config/jwt.config';

@Module({
  imports: [
    ScraperModule,
    // MarketStatsModule,
    DbModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['development.env', 'production.env'],
      load: [configurationFactory, jwtConfigFactory],
      isGlobal: true,
      expandVariables: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // 注入全域 Pipe
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
