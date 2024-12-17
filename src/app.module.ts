import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { APP_GUARD } from '@nestjs/core';
// import { MarketStatsModule } from './market-stats/market-stats.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DbModule } from './db/db.module';
import { UserModule } from './modules/user/user.module';
// import { ScraperModule } from './modules/scraper/scraper.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configurationFactory from './config/configuration.factory';
import jwtConfigFactory from './config/jwt.config';
import { AbilitiesGuard } from 'src/auth/guards/permissions.guard';
import { CaslAbilityModule } from './auth/casl/casl-ability.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { TickerModule } from './modules/ticker/ticker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TickerService } from './modules/ticker/ticker.service';
import { OnApplicationBootstrap } from '@nestjs/common';
import { DateTime } from 'luxon';

@Module({
  imports: [
    // ScraperModule,
    // MarketStatsModule,
    DbModule,
    UserModule,
    AuthModule,
    CaslAbilityModule,
    ConfigModule.forRoot({
      envFilePath: ['development.env', 'production.env'],
      load: [configurationFactory, jwtConfigFactory],
      isGlobal: true,
      expandVariables: true,
    }),
    ScheduleModule.forRoot(),
    TickerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // 注入全域 Pipe
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly tickerService: TickerService) {}
  async onApplicationBootstrap() {
    // if (process.env.SCRAPER_INIT === 'true') {
    Logger.log('正在初始化應用程式...', AppModule.name);
    for (
      let dt = DateTime.local(), days = 0;
      days < 31;
      dt = dt.minus({ day: 1 }), days++
    ) {
      await this.tickerService.updateTickers(dt.toISODate());
    }
    Logger.log('應用程式初始化完成', AppModule.name);
    // }
  }
}
